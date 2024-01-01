import React, { useState, useEffect } from 'react'
import Header from '../../layout/header/Header'
import Table from 'react-bootstrap/Table';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, dbFile } from "../../config/firebaseConfig";
// import {ref, uploadBytes} from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 } from "uuid"

const MyPost = () => {

  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [fichier, setFichier] = useState("");
  const [categorie, setCategorie] = useState('');
  const [sujets, setSujets] = useState([]);

  const [sujetById, setSujetById] = useState({});


  const [idUpdate, setIdUpdate] = useState(sujetById.id || '');
  const [titreUpdate, setTitreUpdate] = useState(sujetById.titre || '');
  const [descriptionUpdate, setDescriptionUpdate] = useState(sujetById.description || '');
  const [fichierUpdate, setFichierUpdate] = useState("");
  const [categorieUpdate, setCategorieUpdate] = useState(sujetById.categorie || '');


  // const [sujetsUpdate, setSujetsUpdate] = useState([]);

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
      // console.log('Fichier téléchargé. URL de téléchargement :', downloadURL);
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

      // console.log('Document ajouté avec l\'ID : ', docRef.id);
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

  //recuperer tout les sujet
  const loadSujet = async () => {
    const s = [];
    const querySnapshot = await getDocs(collection(db, "sujetMemoire"));

    querySnapshot.forEach((doc) => {
      const sujetData = { id: doc.id, ...doc.data() };

      // Ajouter une condition pour filtrer par auteur
      if (sujetData.auteur === localStorage.getItem('nomUtilisateur')) {
        s.push(sujetData);
        setSujets(s);
      }
    });

    loadSujet()


  }

  const getSujetById = async (id) => {
    const allSujet = collection(db, "sujetMemoire");

    const sujetRef = doc(allSujet, id);

    try {
      const recupSujet = await getDoc(sujetRef);

      if (recupSujet.exists()) {
        const sujet = recupSujet.data();
        setSujetById(sujet);
        console.log("sujet avec l'ID", id, ":", sujet);
      } else {
        console.log("Aucun sujet trouvé avec l'ID", id);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }

  //modifier un sujet ❌
  const updateSujet = async (id) => {
    try {
      const selectedSujet = doc(db, "sujetMemoire", id);

      // Télécharger le fichier en utilisant addFile
      const downloadURL = await addFile();

      const newData = {
        titre: titreUpdate,
        description: descriptionUpdate,
        fichier: downloadURL, // Utiliser l'URL du fichier téléchargé
        categorie: categorieUpdate,
      };

      await updateDoc(selectedSujet, newData);

      // Recharger les sujets après la mise à jour
      loadSujet();

      // Réinitialiser les états utilisés dans le formulaire de modification
      setTitreUpdate("");
      setDescriptionUpdate("");
      setCategorieUpdate("");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du sujet de mémoire", error);
      // Gérer les erreurs de manière appropriée (affichage d'un message d'erreur, etc.)
    }

  }

  useEffect(() => {
    loadSujet();
    setTitreUpdate(sujetById.titre || '');
    setDescriptionUpdate(sujetById.description || '');
    setCategorieUpdate(sujetById.categorie);
  }, [sujetById.titre, sujetById.description, sujetById.categorie]);

  return (
    <div >
      <Header />
      <div className='container px-5 my-5'>
        <button className='btn btn-primary mb-3' data-bs-toggle="modal" data-bs-target="#ajouterSujetMemoire" onClick={() => { recupCategorie() }}>Ajouter un sujet</button>

        <Table bordered hover>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Description</th>
              <th>Fichier</th>
              <th>Date de publication</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sujets.map((sujet) => (
              <tr key={sujet.id}>
                <td>{sujet.titre}</td>
                <td>{sujet.categorie}</td>
                <td>
                  <button type="button" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { getSujetById(sujet.id) }}>
                    Voir la description
                  </button>
                </td>
                <td>
                  <a className="btn btn-sm btn-primary w-100" href={sujet.fichier} target="_blank" rel="noopener noreferrer">
                    <span>Voir <i className="bi bi-eye-fill"></i></span>
                  </a>
                </td>
                <td>{sujet.createdAt.toDate().toLocaleString()}</td>
                <td>
                  <button type="button" className="btn btn-sm me-3 btn-warning" data-bs-toggle="modal" data-bs-target="#modifierSujetMemoire" onClick={() => { getSujetById(sujet.id) }}>
                    Modifier
                  </button>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => confirmDeleteSujet(sujet.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* <!-- Modal description --> */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Description</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>{sujetById.description}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
          </div>
        </div>
      </div>

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

      {/* modal modifier*/}
      <div className="modal fade" id="modifierSujetMemoire" tabIndex="-1" aria-labelledby="modifierSujetMemoireLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modifierSujetMemoireLabel">Modifier sujet</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <Form className='container'>
                <FloatingLabel controlId="floatingInput" label="Titre" className="mb-3">
                  <Form.Control type="text" placeholder="Veuillez entrer le titre" value={titreUpdate} onChange={(e) => setTitreUpdate(e.target.value)}  />
                </FloatingLabel>

                <FloatingLabel controlId="floatingTextarea2" label="Description">
                  <Form.Control as="textarea" placeholder="Leave a comment here" style={{ height: '100px' }} className="mb-3"  onChange={(e) => setDescriptionUpdate(e.target.value)} value={descriptionUpdate}
                   
                  />
                </FloatingLabel>

                <Form.Group controlId="formFileSm" className="mb-3">
                  <Form.Control type="file" size="sm" onChange={handleChange} />
                </Form.Group>

                <Form.Select aria-label="Default select example" onChange={(e) => setCategorieUpdate(e.target.value)} onClick={() => { recupCategorie() }} >
                  <option>{categorieUpdate}</option>
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
              <button type="button" className="btn btn-warning" data-bs-dismiss="modal" onClick={() => { updateSujet(idUpdate) }}>Modifeir</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MyPost