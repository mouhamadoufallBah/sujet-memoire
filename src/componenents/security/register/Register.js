import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate  } from 'react-router-dom';
import firebase from '../../config/firebaseConfig'

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
            //creation d'utilisateur dans firebase
           await firebase.auth().createUserWithEmailAndPassword(email,password);
            alert("Inscription avec succées");

            //redirection vers l'acceuil
            navigate('/login');
        } catch (error) {
            alert(error)
        }
    }
    return (
        <div className='container'>
            <Form className='container'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nom complet</Form.Label>
                    <Form.Control type="text" value={nomComplet} placeholder="Veuillez entrer votre nom et prenom" onChange={(e) => setNomComplet(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} placeholder="Veuillez entrer votre email" onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control type="password" value={password} placeholder="Veuillez entrer votre Mot de passe" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={submit}>
                    S'inscrire
                </Button>
                <Link to="/login" className='ms-3'>
                    <Button variant="outline-primary">Se connecter</Button>
                </Link>

            </Form>
        </div>
    )
}

export default Register