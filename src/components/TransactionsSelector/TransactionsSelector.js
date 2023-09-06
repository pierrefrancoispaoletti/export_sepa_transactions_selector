import {
  Alert,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment } from "react";
import colors from "../../colors";

const { textColor, textColorLight, backgroundColor, backgroundColorLight } =
  colors;

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
  debitor,
  getTransactionsToExportTotal,
  getTransactionsDatesByCrediteur,
  handleChangeTransactionsToExportDateExecution,
}) => {
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
              style={{ background: backgroundColor }}
            >
              <Checkbox
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
              DOCUMENT
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
              FOURNISSEUR
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
              DATE EXECUTION
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
              MONTANT
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
                  <TableCell colSpan={7} align="left" sx={{ margin: "34px 0" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        component="span"
                        sx={{
                          display: "inline-block",
                          background: backgroundColorLight,
                          padding: "10px",
                        }}
                      >
                        <strong style={{ color: textColorLight }}>
                          Pour le fournisseur :{" "}
                        </strong>
                        {nomCrediteur}
                      </Typography>
                      {getTransactionsDatesByCrediteur()?.[nomCrediteur]
                        ?.length > 1 &&
                        isTransactionInvalid(nomCrediteur) &&
                        isGrouped && (
                          <Stack justifyContent="center" alignItems="center">
                            <Alert
                              severity="warning"
                              sx={{ marginBottom: "6px" }}
                              variant="filled"
                            >
                              Attention : Les dates d'exécution ne sont pas
                              équivalentes. Pour générer un export groupé,
                              veuillez sélectionner une date d'exécution unique
                              qui sera appliquée pour lors de l'export.
                            </Alert>
                            <Box>
                              <FormControl>
                                <TextField
                                  type="date"
                                  fullWidth={false}
                                  onChange={handleChangeTransactionsToExportDateExecution(
                                    nomCrediteur
                                  )}
                                />
                              </FormControl>
                            </Box>
                          </Stack>
                        )}
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
                      <InputLabel style={{ color: textColor }}>
                        Debiteur
                      </InputLabel>
                      <Select
                        value={
                          debitor.find((d) => d.nomCrediteur === nomCrediteur)
                            ?.debitor_id || ""
                        }
                        onChange={handleChangeDebitor(
                          transactions,
                          nomCrediteur
                        )}
                        label="Debiteur"
                        variant="outlined"
                      >
                        {DEBITORS_ACCOUNT.map(
                          ({ id, nom_debiteur, iban, bic, format }) => (
                            <MenuItem key={id} value={id}>
                              {`${nom_debiteur} - ${iban} - ${bic} - ${format}`}
                            </MenuItem>
                          )
                        )}
                      </Select>
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
                          : isGrouped &&
                            getTransactionsDatesByCrediteur()?.[nomCrediteur]
                              ?.length > 1
                          ? `Les transactions selectionées ont une date d'echeance differente`
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
                          isTransactionInvalid(nomCrediteur, ttc)
                            ? { background: "rgba(241, 102, 83, 0.2)" }
                            : { background: "rgba(27, 94, 32, 0.2)" }
                        }
                      >
                        <TableCell component="th" scope="row" align="center">
                          <Checkbox
                            style={{ color: backgroundColor }}
                            checked={
                              isTransactionToBeExported(Res_Id) &&
                              isTransactionInvalid(nomCrediteur, ttc) === false
                            }
                            disabled={isTransactionInvalid(nomCrediteur, ttc)}
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
                        <TableCell component="th" scope="row" align="center">
                          {date_execution}
                        </TableCell>
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
                    <TableCell colSpan={7} align="right">
                      <Typography
                        sx={{ fontWeight: "bold", color: backgroundColor }}
                      >
                        TOTAL {nomCrediteur} :{" "}
                        {totalTransactionsToExport[nomCrediteur].toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsSelector;
