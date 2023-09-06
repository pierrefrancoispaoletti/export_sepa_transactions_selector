import {
  Alert,
  Box,
  Container,
  FormControlLabel,
  Snackbar,
  Stack,
  Switch,
} from "@mui/material";
import Header from "../Header/Header";
import {
  accountDebitors,
  documents,
  messagesErreur,
} from "../../dummy-data/test-data";
import TransactionsSelector from "../TransactionsSelector/TransactionsSelector";
import { useEffect, useState } from "react";
import axios, { all } from "axios";
import URL_GENERATION from "../../_config";
import LoadingButton from "@mui/lab/LoadingButton";
import colors from "../../colors";
import "./App.css";

const ACCOUNT_DEBITORS = window.comptesDebiteurs ?? accountDebitors;
const DOCUMENTS = window.documents ?? documents;
const MESSAGES_ERREURS = window.messagesErreurs ?? messagesErreur ?? [];

const { textColorLight, backgroundColor, actionColor } = colors;

const App = () => {
  const [transactions, setTransactions] = useState([...DOCUMENTS]);
  const [transactionsToExport, setTransactionsToExport] = useState([]);
  const [isGrouped, setIsGrouped] = useState(
    localStorage.getItem("isGrouped") === "true"
  );
  const [loading, setLoading] = useState(false);
  const [transactionTotals, setTransactionTotals] = useState({});
  const [debitor, setDebitor] = useState([]);

  const [erreurs, setErreurs] = useState(MESSAGES_ERREURS);

  const [message, setMessage] = useState(null);

  const [hideErrors, setHideErrors] = useState(true);

  const getTransactionsToExportTotal = () => {
    return transactionsToExport.reduce((acc, { nomCrediteur, ttc }) => {
      acc[nomCrediteur] = (acc[nomCrediteur] || 0) + Number(ttc);
      return acc;
    }, {});
  };

  const isTransactionInvalid = (nomCrediteur, ttc) => {
    return (
      (isGrouped && transactionTotals[nomCrediteur] < 0) ||
      (!isGrouped && Number(ttc) < 0) ||
      (isGrouped &&
        getTransactionsDatesByCrediteur()?.[nomCrediteur]?.length > 1)
    );
  };

  const isTransactionOK = (transactions) => {
    const totalTransactionsByNomCrediteur = transactions.reduce(
      (acc, { nomCrediteur, ttc }) => {
        acc[nomCrediteur] = (acc[nomCrediteur] || 0) + Number(ttc);
        return acc;
      },
      {}
    );
    return totalTransactionsByNomCrediteur;
  };

  const getTransactionsDatesByCrediteur = () => {
    // Initialisation d'un objet vide pour stocker les résultats
    const result = {};

    // Parcours de chaque transaction dans le tableau transactionsToExport
    transactionsToExport.forEach(({ nomCrediteur, date_execution }) => {
      // Vérification si le créancier existe déjà dans le résultat
      if (!result.hasOwnProperty(nomCrediteur)) {
        // Si le créancier n'existe pas, on l'ajoute avec un tableau vide pour les dates
        result[nomCrediteur] = [];
      }

      // Vérification si la date_execution existe déjà dans le tableau de dates pour le créancier
      if (!result[nomCrediteur].includes(date_execution)) {
        // Si la date_execution n'existe pas, on l'ajoute au tableau de dates pour le créancier
        result[nomCrediteur].push(date_execution);
      }
    });

    // Retourne l'objet contenant le nombre de dates associées à chaque créancier
    return result;
  };

  const handleChangeTransactionsToExportDateExecution =
    (nomCrediteur) => (e) => {
      const { value } = e.target;
      let newDate = new Date(value).toLocaleDateString("fr-FR");
      setTransactionsToExport((transactionsToExport) => {
        return transactionsToExport.map((transaction) =>
          transaction.nomCrediteur === nomCrediteur
            ? { ...transaction, date_execution: newDate }
            : transaction
        );
      });
      setTransactions((transactions) => {
        return transactions.map((transaction) =>
          transaction.nomCrediteur === nomCrediteur
            ? { ...transaction, date_execution: newDate }
            : transaction
        );
      });
    };

  const isTransactionToBeExported = (Res_id) => {
    return transactionsToExport.some(
      (transaction) => transaction.Res_Id === Res_id
    );
  };

  const isAllTransactionsSelected = () => {
    return transactionsToExport.length === transactions.length;
  };

  const selectTransaction = (Res_Id) => (e) => {
    const { checked } = e.target;
    if (checked) {
      setTransactionsToExport((transactionsToExport) => [
        ...transactionsToExport,
        transactions.find((transaction) => transaction.Res_Id === Res_Id),
      ]);
    } else {
      setTransactionsToExport((transactionsToExport) =>
        transactionsToExport.filter(
          (transaction) => transaction.Res_Id !== Res_Id
        )
      );
    }
  };

  const selectAllTransactions = (e) => {
    const { checked } = e.target;
    if (checked) {
      const validTransactions = transactions.filter(({ nomCrediteur, ttc }) => {
        return isTransactionInvalid(nomCrediteur, ttc) === false;
      });
      setTransactionsToExport(validTransactions);
    } else {
      setTransactionsToExport([]);
    }
  };

  const setGrouped = () => {
    setIsGrouped(!isGrouped);
  };

  const handleChangeDebitor = (transactions, nomCrediteur) => (e) => {
    const { value } = e.target;

    setDebitor((debitor) => {
      const updatedDebitor = debitor.map((deb) =>
        deb.nomCrediteur === nomCrediteur ? { ...deb, debitor_id: value } : deb
      );
      const existingDebitor = updatedDebitor.find(
        (deb) => deb.nomCrediteur === nomCrediteur
      );

      return existingDebitor
        ? updatedDebitor
        : [...updatedDebitor, { nomCrediteur, debitor_id: value }];
    });

    setTransactions((transactions) =>
      transactions.map((transaction) =>
        transaction.nomCrediteur === nomCrediteur
          ? { ...transaction, debitor_id: value }
          : transaction
      )
    );
    setTransactionsToExport((transactionsToExport) =>
      transactionsToExport.map((transaction) =>
        transaction.nomCrediteur === nomCrediteur
          ? { ...transaction, debitor_id: value }
          : transaction
      )
    );

    const storedDebitors = localStorage.getItem("debitors");
    const debitorData = storedDebitors ? JSON.parse(storedDebitors) : {};
    debitorData[nomCrediteur] = value;
    localStorage.setItem("debitors", JSON.stringify(debitorData));
  };

  const handleGenerateXML = async (e) => {
    e.preventDefault();

    // ici on refait un balayage sur les transactions valides avant d'envoyer a l'enregistrement
    const transactions = transactionsToExport.filter(
      ({ nomCrediteur, ttc }) => {
        return isTransactionInvalid(nomCrediteur, ttc) === false;
      }
    );
    if (transactions.length === 0) {
      setMessage({
        status: "warning",
        message: "Aucune transaction selectionée",
      });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("transactions", JSON.stringify(transactions));
    formData.append("isGrouped", isGrouped);

    try {
      const response = await axios({
        method: "post",
        url: URL_GENERATION,
        data: formData,
        responseType: "blob",
      });

      if (response.data.status && response.data.status === "error") {
        alert(response.data.message);
      } else {
        let blob = null;

        if (response.headers["content-type"] === "application/xml") {
          blob = new Blob([response.data], {
            type: "application/xml",
          });
        } else {
          blob = new Blob([response.data], {
            type: "application/zip",
          });
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition.length > 0) {
          const filename = contentDisposition?.split("filename=")[1];
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (error) {
      alert("Il y à eu une erreur lors de la génération du xml");
    }
    setLoading(false);
  };

  useEffect(() => {
    let prefs = localStorage.getItem("debitors");

    const favouriteDebitor = ACCOUNT_DEBITORS.find(
      (debitor) => debitor.favourite === "1"
    );

    if (favouriteDebitor && !prefs) {
      setMessage({
        status: "success",
        message: "Compte favori chargé pour tous les fournisseurs",
      });
      const map1 = new Map();
      const allCrediteurs = new Set(
        transactions.map((debitor) => debitor.nomCrediteur)
      );
      for (const key of allCrediteurs) {
        map1.set(key, favouriteDebitor.id);
      }
      let infosA = Array.from(map1.entries());

      let newInfosA = infosA.map(([nomCrediteur, debitor_id]) => ({
        debitor_id,
        nomCrediteur,
      }));

      setDebitor(newInfosA);

      setTransactions((transactions) =>
        transactions.map((transaction) => ({
          ...transaction,
          debitor_id: favouriteDebitor.id,
        }))
      );
      setTransactionsToExport((transactionsToExport) =>
        transactionsToExport.map((transaction) => ({
          ...transaction,
          debitor_id: favouriteDebitor.id,
        }))
      );
    }

    if (prefs) {
      setMessage({
        status: "success",
        message: "Comptes personalisés chargé pour les fournisseurs",
      });
      const infosB = Object.entries(JSON.parse(prefs));
      let newInfos = infosB.map(([nomCrediteur, debitor_id]) => ({
        debitor_id,
        nomCrediteur,
      }));

      setDebitor(newInfos);

      newInfos.map(({ debitor_id, nomCrediteur }) => {
        setTransactions((transactions) =>
          transactions.map((transaction) =>
            transaction.nomCrediteur === nomCrediteur
              ? { ...transaction, debitor_id }
              : transaction
          )
        );
        setTransactionsToExport((transactionsToExport) =>
          transactionsToExport.map((transaction) =>
            transaction.nomCrediteur === nomCrediteur
              ? { ...transaction, debitor_id }
              : transaction
          )
        );
      });
    }
  }, []);

  useEffect(() => {
    setTransactionTotals(isTransactionOK(transactions));
  }, [transactions]);

  useEffect(() => {
    // Vérifier si des transactions non valides sont sélectionnées
    const invalidTransactions = transactionsToExport.filter(
      ({ nomCrediteur, ttc }) => {
        return isTransactionInvalid(nomCrediteur, ttc);
      }
    );

    if (invalidTransactions.length > 0) {
      // Filtrer les transactions non valides et mettre à jour transactionsToExport
      const validTransactions = transactionsToExport.filter(
        ({ nomCrediteur, ttc }) => {
          return isTransactionInvalid(nomCrediteur, ttc) === false;
        }
      );
      setTransactionsToExport(validTransactions);
    }
  }, [isGrouped, transactions]);

  useEffect(() => {
    localStorage.setItem("isGrouped", isGrouped);
  }, [isGrouped]);

  return (
    <div className="App" style={{ height: "1vh" }}>
      {message && (
        <Snackbar
          open={message !== null}
          autoHideDuration={5000}
          onClose={() => setMessage(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={message.status} onClose={() => setMessage(null)}>
            {message.message}
          </Alert>
        </Snackbar>
      )}
      <Container>
        {erreurs.length > 0 &&
          !hideErrors &&
          erreurs.map((erreur, index) => (
            <Alert
              onClose={() =>
                setErreurs((erreurs) => erreurs.filter((_, i) => i !== index))
              }
              key={index}
              sx={{ margin: "6px", fontWeight: "bold" }}
              severity="error"
            >
              {erreur}
            </Alert>
          ))}
        <Header />
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <FormControlLabel
            value="top"
            sx={{
              color: backgroundColor,
              textTransform: "uppercase",
              display: "flex",
              padding: "10px",
              margin: "10px",
            }}
            control={
              <Switch checked={isGrouped} onChange={() => setGrouped()} />
            }
            label="Regrouper les transactions"
            labelPlacement="start"
          />
          {erreurs.length > 0 && (
            <Stack>
              {hideErrors && (
                <Alert variant="filled" severity="warning">
                  Il y a {erreurs.length} documents en erreur dans l'export
                </Alert>
              )}
              <FormControlLabel
                value="top"
                sx={{
                  color: backgroundColor,
                  textTransform: "uppercase",
                  display: "flex",
                  padding: "10px",
                  margin: "10px",
                }}
                control={
                  <Switch
                    checked={hideErrors}
                    onChange={() => setHideErrors(!hideErrors)}
                  />
                }
                label="Masquer les erreurs"
                labelPlacement="start"
              />
            </Stack>
          )}
        </Container>
        <form onSubmit={handleGenerateXML}>
          <TransactionsSelector
            transactions={transactions}
            isTransactionToBeExported={isTransactionToBeExported}
            handleChangeDebitor={handleChangeDebitor}
            selectTransaction={selectTransaction}
            DEBITORS_ACCOUNT={ACCOUNT_DEBITORS}
            selectAllTransactions={selectAllTransactions}
            isAllTransactionsSelected={isAllTransactionsSelected}
            isGrouped={isGrouped}
            transactionTotals={transactionTotals}
            isTransactionInvalid={isTransactionInvalid}
            debitor={debitor}
            getTransactionsToExportTotal={getTransactionsToExportTotal}
            getTransactionsDatesByCrediteur={getTransactionsDatesByCrediteur}
            handleChangeTransactionsToExportDateExecution={
              handleChangeTransactionsToExportDateExecution
            }
          />
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              paddingTop: "40px",
            }}
          >
            <LoadingButton
              disabled={transactionsToExport.length === 0 || loading}
              sx={{
                background: actionColor,
                color: textColorLight,
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
              variant="contained"
              type="submit"
              loading={loading}
            >
              {!loading ? "Générer l'export SEPA" : "XML en cours de création"}
            </LoadingButton>
          </Container>
        </form>
      </Container>
    </div>
  );
};
export default App;
