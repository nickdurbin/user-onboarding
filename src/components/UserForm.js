import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

function UserForm({ values, errors, touched, isSubmitting, status }) {

  const [users, setUsers] = useState([])
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

      {touched.name && errors.name && <p className="error"> {errors.name}</p>}
      <Field type="name" name="name" placeholder="Name" />

      {touched.email && errors.email && <p className="error">{errors.email}</p>}
      <Field type="email" name="email" placeholder="Email" />

      {touched.password && errors.password && <p className="error">{errors.password}</p>}
      <Field type="password" name="password" placeholder="Password" />

      {touched.group && errors.group && <p className="error">{errors.group}</p>}
      <Field className="dropDown" component="select" name="group">
        <option value="" disabled>Select Group:</option>
        <option value="full-time">Full-Time</option>
        <option value="part-time">Part-Time</option>
        <option value="team">Team Lead</option>
        <option value="section">Section Lead</option>
      </Field>

      <label>
        <Field className="checkbox" type="checkbox" name="tos" checked={values.tos} />
        <span>Accept Terms</span>
      </label>

      <button className="formButton" type="submit" disabled={isSubmitting}>Submit!</button>
    </Form>
    {users.map((user, index) => {
        return (
          <div className='userContainer' key={index} index={index}>
            <h1>New User Info</h1>
            <h2>Name: {user.name}</h2>
            <h4>Email: {user.email}</h4>
            <h4>Groups: {user.group}</h4>
          </div>
      ) })}
     </>
  );
}

export default withFormik({
  mapPropsToValues({ name, email, password, group, tos }) {
    
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      group: group || "",
      tos: tos || false
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required()
      .min(3,"Name not valid")
      .required("Name is required"),
    email: Yup.string()
      .email("Email not valid")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be 8 characters or longer")
      .required("Password is required"),
    group: Yup.string()
      .required("Please choose a group"),
    tos: Yup.boolean().oneOf([ true ], "Please agree to Terms of Service!")
  }),

  handleSubmit(values, { resetForm, setErrors, setSubmitting, setStatus }) {
    if (values.email === "waffle@syrup.com") {
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