import axios from "axios";

const API_URL =
"https://us-central1-caltrack-efa95.cloudfunctions.net/searchFood";

export async function searchFood(
query:string
){

try{

if(!query?.trim()){
return [];
}

const response=
await axios.get(
API_URL,
{
params:{
q:query
}
}
);

console.log(
"FUNCTION RESPONSE:",
response.data
);

const foods=
response?.data?.foods?.food;

if(!foods){
return [];
}

return Array.isArray(
foods
)
? foods
: [foods];

}catch(e){

console.log(
"SEARCH ERROR:",
e
);

return [];

}

}

export function parseFoodItem(item: any) {
  const desc: string = item.food_description || "";
  const calories = Number(desc.match(/Calories:\s*([\d.]+)/)?.[1] || 0);
  const fat = Number(desc.match(/Fat:\s*([\d.]+)/)?.[1] || 0);
  const carbs = Number(desc.match(/Carbs:\s*([\d.]+)/)?.[1] || 0);
  const protein = Number(desc.match(/Protein:\s*([\d.]+)/)?.[1] || 0);
  return {
    name: item.food_name,
    calories,
    fat,
    carbs,
    protein
  };
}

export async function getFoodByBarcode(barcode: string) {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    );

    if (response.data?.status !== 1) return null;

    const product = response.data.product;
    const nutriments = product?.nutriments;

    if (!nutriments) return null;

    return {
      name: product.product_name || product.brands || "Nieznany produkt",
      calories: Number(nutriments["energy-kcal_100g"] || 0),
      protein: Number(nutriments["proteins_100g"] || 0),
      fat: Number(nutriments["fat_100g"] || 0),
      carbs: Number(nutriments["carbohydrates_100g"] || 0)
    };
  } catch (e) {
    console.log("BARCODE ERROR:", e);
    return null;
  }
}