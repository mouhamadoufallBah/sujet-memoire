import React, { useState, useEffect } from 'react';
import Header from '../../layout/header/Header';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db, dbFile } from "../../config/firebaseConfig";
// import {ref, uploadBytes} from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 } from "uuid"


const Home = () => {

    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [fichier, setFichier] = useState("");
    const [categorie, setCategorie] = useState('');
    const [sujets, setSujets] = useState([]);

    const [listCategories, setListCategories] = useState([]);


    const recupCategorie = async () => {
        const arrayCats = [];
        const querySnapshot = await getDocs(collection(db, "categorie"));
        querySnapshot.forEach((doc) => {
            arrayCats.push({ id: doc.id, ...doc.data() });
            // console.log(`${doc.id} =>  ${doc.data().nom}  ${doc.data().id}`);
        });

        setListCategories(arrayCats);
    }

    const handleChange = (e) => {
        // Mettre à jour l'état avec le fichier sélectionné
        setFichier(e.target.files[0]);
    };

    const addFile = async () => {
        try {
            const fileref = ref(dbFile, `fichier/${v4()}`);
            const uploadTask = uploadBytesResumable(fileref, fichier);

            await uploadTask;

            const downloadURL = await getDownloadURL(fileref);
            console.log('Fichier téléchargé. URL de téléchargement :', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('Erreur lors du téléchargement du fichier : ', error);
            alert('Échec du téléchargement du fichier');
            throw error;
        }
    };

    const addSujet = async () => {
        try {
            const downloadURL = await addFile();

            const docRef = await addDoc(collection(db, 'sujetMemoire'), {
                titre: titre,
                description: description,
                fichier: downloadURL,
                categorie: categorie,
                auteur: localStorage.getItem('nomUtilisateur'),
                createdAt: new Date(),
            });

            console.log('Document ajouté avec l\'ID : ', docRef.id);
            alert('Ajouté');


        } catch (error) {
            console.error('Erreur lors de l\'ajout du document : ', error);
            alert('Non ajouté');
        }
    };

    const deleteSujet = async (id) => {
        try {
            const selectedSujet = doc(db, "sujetMemoire", id);
            await deleteDoc(selectedSujet);
            alert("Sujet supprimé avec succès");
            loadSujet();  // Chargement des sujets après la suppression réussie
        } catch (error) {
            console.error("Erreur lors de la suppression du sujet : ", error);
            alert("Échec de la suppression du sujet");
        }
    };

    const confirmDeleteSujet = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce sujet ?")) {
            deleteSujet(id);
        }
    }


    const loadSujet = async () => {
        const s = [];
        const querySnapshot = await getDocs(collection(db, "sujetMemoire"));
        querySnapshot.forEach((doc) => {
            s.push({ id: doc.id, ...doc.data() });;
            setSujets(s);
        });

        loadSujet()


    }

    useEffect(() => {
        loadSujet();
    }, []);



    return (
        <div>

            <Header />


            <header className="bg-dark py-5">
                <div className="container px-5">
                    <div className="row gx-5 align-items-center justify-content-center">
                        <div className="col-lg-8 col-xl-7 col-xxl-6">
                            <div className="my-5 text-center text-xl-start">
                                <h1 className="display-5 fw-bolder text-white mb-2">A Bootstrap 5 template for modern businesses</h1>
                                <p className="lead fw-normal text-white-50 mb-4">Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit!</p>
                                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                                    <a className="btn btn-primary btn-lg px-4 me-sm-3" href="#features">Get Started</a>
                                    <button className="btn btn-outline-light btn-lg px-4" data-bs-toggle="modal" data-bs-target="#ajouterSujetMemoire" onClick={() => { recupCategorie() }}>Faire une publication </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-xxl-6 d-none d-xl-block text-center"><img className="img-fluid rounded-3 my-5" src="https://dummyimage.com/600x400/343a40/6c757d" alt="..." /></div>
                    </div>
                </div>
            </header>


            {/* Afficher les sujets ici */}
            <section className="py-1" id="features">
                <div className="container px-5 my-5">
                    <div className="row gx-5 justify-content-center">
                        <div className="col-lg-8 col-xl-6">
                            <div className="text-center">
                                <h2 className="fw-bolder mb-5">La liste des mémoires</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row gx-5">
                        {sujets.map((sujet) => (
                            <div key={sujet.id} className="col-lg-4 mb-5">
                                <div className="card h-100 shadow border-0">
                                    <img className="card-img-top" src="https://dummyimage.com/600x350/ced4da/6c757d" alt="..." />
                                    <div className="card-body p-4">
                                        <div className="badge bg-primary bg-gradient rounded-pill mb-2">{sujet.categorie}</div>
                                        <h5 className="card-title mb-3">{sujet.titre}</h5>
                                        <p className="card-text mb-0">{sujet.description}</p>
                                    </div>
                                    <div className="card-footer p-4 pt-0 bg-transparent border-top-0">
                                        <div className="d-flex align-items-end justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <img className="rounded-circle me-3" src="https://dummyimage.com/40x40/ced4da/6c757d" alt="..." />
                                                <div className="small">
                                                    <div className="fw-bold">{sujet.auteur}</div>
                                                    <div className="text-muted">{sujet.createdAt.toDate().toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="small mt-3">
                                            <a className="btn btn-sm btn-primary w-100" href={sujet.fichier} target="_blank" rel="noopener noreferrer">
                                                <span>Télécharger <i class="bi bi-download"></i></span>
                                            </a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* modal ajouter*/}
            <div className="modal fade" id="ajouterSujetMemoire" tabIndex="-1" aria-labelledby="ajouterSujetMemoireLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="ajouterSujetMemoireLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <Form className='container'>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Titre"
                                    className="mb-3"
                                >
                                    <Form.Control type="text" placeholder="Veuillez entrer le titre" onChange={(e) => setTitre(e.target.value)} />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingTextarea2" label="Description">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Leave a comment here"
                                        style={{ height: '100px' }}
                                        className="mb-3"
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </FloatingLabel>

                                <Form.Group controlId="formFileSm" className="mb-3">
                                    <Form.Control type="file" size="sm" onChange={handleChange} />
                                </Form.Group>

                                <Form.Select aria-label="Default select example" onChange={(e) => setCategorie(e.target.value)}>
                                    <option>Veuillez sélectionner la catégorie</option>
                                    {listCategories.map((categorie) => (
                                        <option key={categorie.id} value={categorie.nom}>
                                            {categorie.nom}
                                        </option>
                                    ))}
                                </Form.Select>

                            </Form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => { addSujet() }}>Publier</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Home