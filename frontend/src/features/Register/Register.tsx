import React, { useState } from 'react';
import axios from 'axios';

function Register() {

    const [values, setValues] = useState({

        name: '',
        email: '',
        password: '',
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('hhtp://localhost:8001/register', values)
        .then(res => console.log(res))
        .then(err => console.log(err));
    }
    return (
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
            <div className="bg-black p rounded w">
                <h2>Sig-Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="Name">
                            <strong>Name</strong>
                        </label>
                        <input
                            type="Name"
                            placeholder="Enter Name"
                            name="Name"
                            onChange={e => setValues({...values, name: e.target.value})} className="form-control rounded-0"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            onChange={e => setValues({...values, email: e.target.value})} className="form-control rounded-0"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            onChange={e => setValues({...values, password: e.target.value})} className="form-control rounded-0"
                        />
                    </div>


                    <button
                        type="submit"
                        className="btn btn-success w-100 rounded-0"
                    >
                        Sign-in
                    </button>

                    <p>You are agree to our terms and policies</p>

                    <button
                        className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
                    >
                        Sig-in
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;