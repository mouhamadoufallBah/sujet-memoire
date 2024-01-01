import { React, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebase from '../../config/firebaseConfig'
import "./login.css";
import Swal from 'sweetalert2';

const auth = getAuth();

const Login = () => {
    //creer les variables et leur setter pour la modification 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //navigationvers les autre pages
    const navigate = useNavigate();

    //fonction qui s'execute lorsqu'on appuie sur le button se connecter
    const connexion = async (e) => {
        //empecher le chargement de la page
        e.preventDefault();
        try {
            //connexion avec l'utilisateur qu'on a inscrit de notre base firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);


            // Récupérer l'ID de l'utilisateur connecté
            const userId = userCredential.user.uid;

            // Stocker l'ID dans le local storage
            localStorage.setItem('userId', userId);

            const user = auth.currentUser;

            const nomUtilisateur = user.displayName;

            // Stocker le nom d'utilisateur dans le local storage
            localStorage.setItem('nomUtilisateur', nomUtilisateur);

            // alert("Connexion avec succées")
            Swal.fire("Connexion fait avec succès", "", "success");


            //redirection vers l'acceuil
            navigate('/home');
        } catch (error) {
            // alert(error)
            Swal.fire("Erreur de connexion", error.message, "error");
        }
    }

    return (
      // <div className='container'>
      //     <Form className='container'>
      //         <Form.Group className="mb-3" controlId="formBasicEmail">
      //             <Form.Label>Email</Form.Label>
      //             <Form.Control type="email" value={email} placeholder="Veuillez entrer votre email" onChange={(e) => setEmail(e.target.value)} />
      //         </Form.Group>

      //         <Form.Group className="mb-3" controlId="formBasicPassword">
      //             <Form.Label>Mot de passe</Form.Label>
      //             <Form.Control type="password" value={password} placeholder="Veuillez entrer votre Mot de passe" onChange={(e) => setPassword(e.target.value)} />
      //         </Form.Group>
      //         <Button variant="primary" type="submit" onClick={connexion}>
      //             Connexion
      //         </Button>

      //         <Link to="/register" className='ms-3'>
      //             <Button variant="outline-primary">S'inscrire</Button>
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
                      <h3 className="mb-4">Connexion</h3>
                    </div>
                  </div>
                  <Form className="signin-form">
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
                      onClick={connexion}
                      className="form-control btn btn-primary rounded submit px-3"
                    >
                      Connexion
                    </Button>
                    <div className="form-group d-md-flex">
                      <div className="w-20 text-left"></div>
                      <div className="w-100 text-md-right ms-5">
                        <Link to="/register">
                          Vous n'avez pas de compte? S'inscrire
                        </Link>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Login