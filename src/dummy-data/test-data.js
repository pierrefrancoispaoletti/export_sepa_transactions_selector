// "c3119967-f025-4e40-a460-239b6be05b82" // 1
// c3119967-f025-4e40-a460-239b6be05b82 //1

//c3119967-f025-4e40-a657788-239b6be05b82 // 2
export const documents = [
  {
    Res_Id: "2",
    coll_id: "coll_1",
    ttc: 4267.920000000000072759576141834259033203125,
    id_fournisseur: "1",
    date_execution: "07/11/2023",
    nomCrediteur: "Fournisseur A",
    ibanCrediteur: "FR1420041010050500013M02606",
    bicCrediteur: "PSSTFRPPMON",
    description: "Paiement facture : 123455",
    debitor_id: "",
  },
  {
    Res_Id: "6",
    coll_id: "coll_1",
    ttc: 1000,
    id_fournisseur: "2",
    date_execution: "07/11/2023",
    nomCrediteur: "Fournisseur B",
    ibanCrediteur: "FR7610057191230000013M02606",
    bicCrediteur: "CRLYFRPPXXX",
    description: "Paiement facture : 123455",
    debitor_id: "",
  },
  {
    Res_Id: "8",
    coll_id: "coll_1",
    ttc: 4345,
    id_fournisseur: "2",
    date_execution: "07/11/2023",
    nomCrediteur: "Fournisseur B",
    ibanCrediteur: "FR7610057191230000013M026567",
    bicCrediteur: "CRLYFRPPXXX",
    description: "Paiement facture : 3656",
    debitor_id: "",
  },
];
export const accountDebitors = [
  {
    id: "compteSG",
    collId: "coll_1",
    nom_debiteur: "SG",
    iban: "FR7630004000500060007000800",
    bic: "BNPAFRPPXXX",
    initiatorName: "Pf PAOLETTI enterprises",
    format: "classic",
    favourite: "1",
  },
  {
    id: "compteLaPoste",
    collId: "coll_1",
    nom_debiteur: "LA POSTE",
    iban: "FR7630004000500060007006789",
    bic: "LPOAFRPPXXX",
    initiatorName: "Pf PAOLETTI personel",
    format: "classic",
    favourite: "0",
  },
];
export const formats = ["Classic", "SAGE", "Turbo"];
export const messagesErreur = [
  "Impossible de retrouver l'id du tiers dans le classeur coll_1 pour le document 1 dans le custom custom_n8, le document à été supprimé des transactions",
  "Impossible de retrouver l'id du tiers dans le classeur coll_1 pour le document 2 dans le custom custom_n8, le document à été supprimé des transactions",
  "Impossible de retrouver l'id du tiers dans le classeur coll_1 pour le document 3 dans le custom custom_n8, le document à été supprimé des transactions",
  "Impossible de retrouver l'id du tiers dans le classeur coll_1 pour le document 4 dans le custom custom_n8, le document à été supprimé des transactions",
  "Impossible de retrouver l'id du tiers dans le classeur coll_1 pour le document 5 dans le custom custom_n8, le document à été supprimé des transactions",
];
