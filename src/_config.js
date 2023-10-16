let URL_GENERATION = "";

console.log(process.env.PUBLIC_URL);

if (process.env.NODE_ENV === "production") {
  URL_GENERATION =
    "/_DevClient/EXPORT_SEPA/traitements_php/generation/index.php";
} else {
  URL_GENERATION =
    "http://localhost:8080/EXPORT_SEPA/traitements_php/generation/index.php";
}

export const DEVISE = "EUR";

export default URL_GENERATION;
