import {
  Alert,
  Box,
  Divider,
  FormControl,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment } from "react";
import colors from "../../colors";

const {
  textColor,
  textColorLight,
  backgroundColor,
  invalidFields,
  errorTextColor,
  validateFields,
  borderTable,
} = colors;

const TransactionsSelector = ({
  transactions,
  isTransactionToBeExported,
  handleChangeDebitor,
  selectTransaction,
  DEBITORS_ACCOUNT,
  selectAllTransactions,
  isAllTransactionsSelected,
  isGrouped,
  transactionTotals,
  isTransactionInvalid,
  isValidDates,
  debitor,
  getTransactionsToExportTotal,
  getTransactionsDatesByCrediteur,
  handleChangeTransactionsToExportDateExecution,
}) => {
  console.log(new Date().toISOString().split("T")[0]);
  const totalTransactionsToExport = getTransactionsToExportTotal();
  return (
    <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
      <Table stickyHeader>
        <TableHead
          sx={{
            position: "sticky",
            top: 0,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
            zIndex: 10000,
          }}
        >
          <TableRow>
            <TableCell
              align="center"
              component="th"
              scope="row"
              style={{
                background: backgroundColor,
                border: `4px solid ${borderTable}`,
              }}
            >
              <input
                type="checkbox"
                style={{ color: textColorLight }}
                checked={isAllTransactionsSelected()}
                onClick={(e) => selectAllTransactions(e)}
              />
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              align="center"
              sx={{
                fontWeight: "bold",
                color: textColorLight,
                background: backgroundColor,
              }}
            >
              Document
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              align="center"
              sx={{
                fontWeight: "bold",
                color: textColorLight,
                background: backgroundColor,
              }}
            >
              Fournisseur
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              align="center"
              sx={{
                fontWeight: "bold",
                color: textColorLight,
                background: backgroundColor,
              }}
            >
              IBAN
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              align="center"
              sx={{
                fontWeight: "bold",
                color: textColorLight,
                background: backgroundColor,
              }}
            >
              Date d'exécution
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              align="center"
              sx={{
                fontWeight: "bold",
                color: textColorLight,
                background: backgroundColor,
              }}
            >
              BIC
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              align="center"
              sx={{
                fontWeight: "bold",
                color: textColorLight,
                background: backgroundColor,
              }}
            >
              Montant
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(
            transactions.reduce(
              (
                acc,
                {
                  Res_Id,
                  nomCrediteur,
                  ibanCrediteur,
                  bicCrediteur,
                  ttc,
                  debitor_id,
                  date_execution,
                }
              ) => {
                if (!acc[nomCrediteur]) {
                  acc[nomCrediteur] = [];
                }
                acc[nomCrediteur].push({
                  Res_Id,
                  nomCrediteur,
                  ibanCrediteur,
                  bicCrediteur,
                  ttc,
                  debitor_id,
                  date_execution,
                });
                return acc;
              },
              {}
            )
          ).map(([nomCrediteur, transactions, ttc, Res_Id]) => {
            return (
              <Fragment key={nomCrediteur}>
                <TableRow key={nomCrediteur}>
                  <TableCell
                    colSpan={7}
                    align="left"
                    sx={{
                      margin: "34px 0",
                      border: `4px solid ${borderTable}`,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        component="span"
                        sx={{
                          display: "inline-block",
                          padding: "10px",
                          border: `2px solid ${borderTable}`,
                        }}
                      >
                        <strong>Pour le fournisseur : </strong>
                        {nomCrediteur}
                      </Typography>
                      {/* {((getTransactionsDatesByCrediteur()?.[nomCrediteur]
                        ?.length > 1 &&
                        isGrouped) ||
                        isTransactionInvalid(nomCrediteur)) && (
                        <Stack justifyContent="center" alignItems="center">
                          <Alert
                            severity="warning"
                            sx={{ marginBottom: "6px" }}
                            variant="filled"
                          >
                            Attention : Les dates d'exécution ne sont pas
                            équivalentes ou la date d'execution est postérieure
                            à la date du jour. Pour générer un export groupé,
                            veuillez sélectionner une date d'exécution unique
                            qui sera appliquée lors de l'export.
                          </Alert>
                          <Box>
                            <FormControl>
                              <TextField
                                type="date"
                                fullWidth={false}
                                onChange={handleChangeTransactionsToExportDateExecution(
                                  nomCrediteur
                                )}
                                inputProps={{
                                  min: new Date().toISOString().split("T")[0],
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Stack>
                      )} */}
                    </Stack>
                    <FormControl
                      sx={{ margin: "34px 0" }}
                      fullWidth
                      required={totalTransactionsToExport[nomCrediteur] > 0}
                      disabled={
                        totalTransactionsToExport[nomCrediteur] === undefined ||
                        (isGrouped &&
                          getTransactionsDatesByCrediteur()?.[nomCrediteur]
                            ?.length > 1)
                      }
                    >
                      <label style={{ color: textColor }}>Débiteur</label>
                      <select
                        style={{
                          fontSize: "1.2rem",
                          color: "#3A96DA",
                          fontWeight: "bold",
                        }}
                        value={
                          debitor.find((d) => d.nomCrediteur === nomCrediteur)
                            ?.debitor_id || ""
                        }
                        onChange={handleChangeDebitor(
                          transactions,
                          nomCrediteur
                        )}
                      >
                        {DEBITORS_ACCOUNT.map(
                          ({ id, nom_debiteur, iban, bic, format }) => (
                            <option key={id} value={id}>
                              {`${nom_debiteur} - ${iban} - ${bic} - ${format}`}
                            </option>
                          )
                        )}
                      </select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                {transactions.map(
                  ({
                    Res_Id,
                    nomCrediteur,
                    ibanCrediteur,
                    bicCrediteur,
                    ttc,
                    date_execution,
                  }) => (
                    <Tooltip
                      key={Res_Id}
                      arrow
                      title={
                        isTransactionInvalid(nomCrediteur, ttc) &&
                        getTransactionsDatesByCrediteur()?.[nomCrediteur]
                          ?.length === 1
                          ? `Cette transaction à un montant négatif (${Number(
                              ttc
                            ).toFixed(
                              2
                            )}) et ne peut pas être inclue dans le fichier d'export`
                          : (isGrouped &&
                              getTransactionsDatesByCrediteur()?.[nomCrediteur]
                                ?.length > 1) ||
                            !isValidDates(date_execution)
                          ? `Les transactions selectionées ont une date d'echeance differente ou antérieure à la date du jour`
                          : `Total transactions : ${
                              isGrouped
                                ? Number(
                                    transactionTotals[nomCrediteur]
                                  ).toFixed(2)
                                : Number(ttc).toFixed(2)
                            } pour ${nomCrediteur}`
                      }
                    >
                      <TableRow
                        key={Res_Id}
                        style={
                          isTransactionInvalid(nomCrediteur, ttc) ||
                          !isValidDates(date_execution)
                            ? {
                                background: invalidFields,
                                color: errorTextColor,
                              }
                            : { background: validateFields }
                        }
                      >
                        <TableCell component="th" scope="row" align="center">
                          <input
                            type="checkbox"
                            style={{ color: backgroundColor }}
                            checked={
                              isTransactionToBeExported(Res_Id) &&
                              isTransactionInvalid(nomCrediteur, ttc) ===
                                false &&
                              isValidDates(date_execution)
                            }
                            disabled={
                              isTransactionInvalid(nomCrediteur, ttc) ||
                              !isValidDates(date_execution)
                            }
                            onClick={selectTransaction(Res_Id)}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {Res_Id}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {nomCrediteur}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {ibanCrediteur}
                        </TableCell>
                        {isValidDates(date_execution) ? (
                          <TableCell component="th" scope="row" align="center">
                            {date_execution}
                          </TableCell>
                        ) : (
                          <TableCell component="th" scope="row" align="center">
                            <FormControl>
                              <input
                                type="date"
                                format="dd/MM/yyyy"
                                style={{ background: "white" }}
                                min={new Date().toISOString().split("T")[0]}
                                value={
                                  new Date(
                                    date_execution
                                      .split("/")
                                      .reverse()
                                      .join("-")
                                  )
                                    .toISOString()
                                    .split("T")[0]
                                }
                                onChange={handleChangeTransactionsToExportDateExecution(
                                  nomCrediteur
                                )}
                              />
                            </FormControl>
                          </TableCell>
                        )}
                        <TableCell component="th" scope="row" align="center">
                          {bicCrediteur}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {ttc.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </Tooltip>
                  )
                )}
                {totalTransactionsToExport[nomCrediteur] > 0 && (
                  <TableRow>
                    <TableCell sx={{ border: "none" }} />
                    <TableCell sx={{ border: "none" }} />
                    <TableCell sx={{ border: "none" }} />
                    <TableCell sx={{ border: "none" }} />
                    <TableCell sx={{ border: "none" }} />
                    <TableCell sx={{ border: "none" }} />
                    <TableCell
                      colSpan={1}
                      align="right"
                      sx={{
                        border: `2px solid ${borderTable}`,
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold" }}>
                        TOTAL {nomCrediteur} :{" "}
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(
                          Number(
                            totalTransactionsToExport[nomCrediteur].toFixed(2)
                          )
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                <div style={{ marginBottom: "8px" }} />
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsSelector;
