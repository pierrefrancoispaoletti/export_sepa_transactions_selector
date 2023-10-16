let URL_GENERATION = "";

if (process.env.NODE_ENV === "production") {
  // pour la surcharge et envoyer les infos vers le fichier surchargé
  //"./_DevClient/EXPORT_SEPA/traitements_php/generation/index.php"

  // vers le fichier standard
  //"/_DevClient/EXPORT_SEPA/traitements_php/generation/index.php"
  URL_GENERATION =
    window.surcharge === 1
      ? "./_DevClient/EXPORT_SEPA/traitements_php/generation/index.php"
      : "/_DevClient/EXPORT_SEPA/traitements_php/generation/index.php";
} else {
  URL_GENERATION =
    "http://localhost:8080/EXPORT_SEPA/traitements_php/generation/index.php";
}

export const DEVISE = "EUR";

export default URL_GENERATION;
