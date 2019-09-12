import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

function UserForm({ values, errors, touched, isSubmitting, status }) {

  const {users, setUsers} = useState([])
  console.log(users)

  useEffect(() => {
    if (status) {
      setUsers([ ...users, status ])
    }
  }, [status])

  return (
    <>
    <Form>
      <h1>Login Form</h1>
      <div>
        {touched.name && errors.name && <p className="error"> {errors.name}</p>}
        <Field type="name" name="name" placeholder="Name" />
      </div>
      <div>
        {touched.email && errors.email && <p className="error">{errors.email}</p>}
        <Field type="email" name="email" placeholder="Email" />
      </div>
      <div>
        {touched.password && errors.password && <p className="error">{errors.password}</p>}
        <Field type="password" name="password" placeholder="Password" />
      </div>
      <label>
        <Field type="checkbox" name="tos" checked={values.tos} />
        <span>Accept TOS</span>
      </label>
      <button className="formButton" type="submit" disabled={isSubmitting}>Submit!</button>
    </Form>
   
     </>
  );
}

export default withFormik({
  mapPropsToValues({ name, email, password, tos }) {
    
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || false
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required()
      .min(3,"Name not valid.")
      .required("Name is required"),
    email: Yup.string()
      .email("Email not valid")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be 8 characters or longer")
      .required("Password is required"),
    tos: Yup.boolean().oneOf([ true ], "Please agree to Terms of Service!")
  }),

  handleSubmit(values, { resetForm, setErrors, setSubmitting, setStatus }) {
    if (values.email === "alreadytaken@atb.dev") {
      setErrors({ email: "You already signed up OR you are stealing emails!" });
    } else {
      axios
      .post('https://reqres.in/api/users', values)
      .then(res => {
        setStatus(res.data)
        console.log(res.data, 'Your user has been added to the database!');
        resetForm();
        setSubmitting(false);
      })
      .catch(err => {
        console.log(err, 'Failed to send info to the database!');
        setSubmitting(false);
      });
    }
  }

})(UserForm);