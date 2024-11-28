import { useState, useEffect } from 'react'
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { initializeApp  } from "firebase/app";
import firebaseConfig from "../firebaseConfig";

interface Product {
    name: string;
}

function ProductList() {
    const app = initializeApp(firebaseConfig); 
    const db = getFirestore(app); 
    const [product, setProduct] = useState<Product[]>([]); 
    const [newData, setNewData] = useState<string>("");

    // Lataa tietoja Firestoresta
    const fetchDataFromApi = async () => {
        const fetchedData: Product[] = []; 
        try {
    //
    //
    //
    //
        const response = await fetch('https://idakkr.github.io/pilvipalvelutweb/vko5/Api.html'); 
        if (response.status === 200) {
            const jsonData: Product[] = await response.json();
            jsonData.forEach((doc) => {
                fetchedData.push({ name: doc.name }); 
            });
            setProduct(fetchedData);
        }
    } catch (error) {
        console.error('Virhe tietojen haussa:', error); 
    }
    }; 

    // Lataa tietoja Firestoresta
    const fetchDataFromFs = async () => {
        const querySnapshot = await getDocs(collection(db, "product"));
        const fetchedData: Product[] = []; 
        querySnapshot.forEach((doc) => {
            const docData = doc.data() as Product; 
            fetchedData.push({ name: docData.name }); 
        }); 
        setProduct(fetchedData); 
    }; 

    useEffect(() => {
        fetchDataFromApi(); 
    }, []); 

    // Lisää uusi dokumentti Firestoreen
   const addData = async () => {
        if (newData) {
            await addDoc(collection(db, "product"), {
                name: newData,
            }); 
            setNewData("");
            fetchDataFromApi();
        }
   }; 

   // Syötekentän muutoksen käsittely
   const hanedleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewData(e.target.value); 
   }; 

   return (
        <div>
            <h2>Lisää tuote</h2>
            <ul>
                {product.map((item, index) => (
                    <li key={index}>{item.name}</li>
                 ))}
            </ul>
            <input
                type="text"
                value={newData}
                onChange={hanedleInputChange}
                placeholder="Lisää tietoa"
            />
            <button onClick={addData}>Lisää</button>
        </div>
   ); 
}

export default ProductList; 
