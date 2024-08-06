const mongoose = require('mongoose');

let loginSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/},
    password: { type: String, required: true },
    isEmployer: {type: String, enum: ['Yes', 'No']}
});

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String, required: true },
    apply: { type: String},
    userEmail: {type:String}
});



const Login = mongoose.model('Login', loginSchema);
const Job = mongoose.model('Job', jobSchema);

module.exports = {Login, Job };