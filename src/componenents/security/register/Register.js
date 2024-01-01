import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import firebase from '../../config/firebaseConfig';
import Swal from 'sweetalert2';

const auth = getAuth();

const Register = () => {
    //creer les variables et leur setter pour la modification 
    const [nomComplet, setNomComplet] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //navigationvers les autre pages
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            // Création de l'utilisateur dans Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Mise à jour du profil de l'utilisateur avec le nom complet
            await updateProfile(user, { displayName: nomComplet });

            // alert("Inscription avec succès");
            Swal.fire("Inscription fait avec succès", "", "success");


            // Redirection vers la page de connexion
            navigate('/login');
        } catch (error) {
            // Handle error
            console.error('Error during user registration:', error.message);
            // alert('Erreur lors de l\'inscription. Veuillez réessayer.');
            Swal.fire("Erreur lors de l'inscription", error.message, "error");
        }
    }

    return (
      // <div className='container'>
      //     <Form className='container'>
      //         <Form.Group className="mb-3" controlId="formBasicEmail">
      //             <Form.Label>Nom complet</Form.Label>
      //             <Form.Control type="text" value={nomComplet} placeholder="Veuillez entrer votre nom et prenom" onChange={(e) => setNomComplet(e.target.value)} />
      //         </Form.Group>

      //         <Form.Group className="mb-3" controlId="formBasicEmail">
      //             <Form.Label>Email</Form.Label>
      //             <Form.Control type="email" value={email} placeholder="Veuillez entrer votre email" onChange={(e) => setEmail(e.target.value)} />
      //         </Form.Group>

      //         <Form.Group className="mb-3" controlId="formBasicPassword">
      //             <Form.Label>Mot de passe</Form.Label>
      //             <Form.Control type="password" value={password} placeholder="Veuillez entrer votre Mot de passe" onChange={(e) => setPassword(e.target.value)} />
      //         </Form.Group>
      //         <Button variant="primary" type="submit" onClick={submit}>
      //             S'inscrire
      //         </Button>
      //         <Link to="/login" className='ms-3'>
      //             <Button variant="outline-primary">Se connecter</Button>
      //         </Link>

      //     </Form>
      // </div>

      <div className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-10">
              <div className="wrap d-md-flex">
                <div
                  className="img"
                  style={{
                    backgroundImage:
                      "url(https://img.freepik.com/photos-premium/sa-joie-brille-interieur-photo-jeune-femme-affaires-faisant-pause-dans-son-bureau_590464-2170.jpg)",
                  }}
                ></div>
                <div className="login-wrap p-4 p-md-5">
                  <div className="d-flex">
                    <div className="w-100">
                      <h3 className="mb-4">Inscription</h3>
                    </div>
                  </div>
                  <Form className="signup-form">
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicNomComplet"
                    >
                      <Form.Label>Nom complet</Form.Label>
                      <Form.Control
                        type="text"
                        value={nomComplet}
                        placeholder="Veuillez entrer votre nom et prénom"
                        onChange={(e) => setNomComplet(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        placeholder="Veuillez entrer votre email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        placeholder="Veuillez entrer votre Mot de passe"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={submit}
                      className="form-control btn btn-primary rounded submit px-3"
                    >
                      S'inscrire
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Register