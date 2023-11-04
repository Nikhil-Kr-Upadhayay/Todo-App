import React, { useEffect, useState } from 'react';
import './auth.css';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
	const [login, setLogin] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem('loggedInUser') != null) {
			navigate('/home')
		}
	}, [])

	const handleFormChange = () => {
		setLogin(!login)
	}

	const handleChange = (e) => {
		switch (e.target.name) {
			case 'name':
				setName(e.target.value);
				break;
			case 'email':
				setEmail(e.target.value);
				break;
			case 'password':
				setPassword(e.target.value);
				break;
			default:
				break;

		}
	}

	const handleSignUp = () => {
		var emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
		var passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@]).{8,}$/;
		if (!(name.length > 2)) {
			setError('Name should be more than 2 character');
			return;
		} else if (!emailPattern.test(email)) {
			setError('E-mail is not valid');
			return;
		} else if (!passwordPattern.test(password)) {
			setError('Password is not valid. Password should be greater than 8 character');
			return;
		} else {
			let existingUser = [];
			let users = JSON.parse(localStorage.getItem('users'));
			const user = {
				id: users ? users.length + 1 : 1,
				name, email, password
			}
			if (users && users.length) {
				existingUser = users.filter((item) => item.email === email);
				existingUser && existingUser.length > 0 ? setError('User already exists') : users.push(user);
			} else {
				users = [user];
			}
			if (existingUser && existingUser.length === 0) {
				localStorage.setItem('users', JSON.stringify(users));
				setName(''); setEmail(''); setPassword(''); setLogin(true);
			}
		}
		setTimeout(() => {
			setError('')
		}, 4000);
	}

	const handleSignIn = () => {
		var emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
		var passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@]).{8,}$/;
		if (!emailPattern.test(email)) {
			setError('E-mail is not valid.');
			return;
		} else if (!passwordPattern.test(password)) {
			setError('Password is not valid.');
			return;
		} else {
			let existingUser = null;
			let users = JSON.parse(localStorage.getItem('users'));
			if (users && users.length) {
				existingUser = users.filter((item) => item.email === email);
				if (existingUser.length === 0) {
					setError('user not found.');
					return;
				}
			} else {
				setError('No user exist.');
				return;
			}
			if (existingUser.length !== 0 && existingUser[0].password === password) {
				localStorage.setItem('loggedInUser', JSON.stringify(existingUser[0]));
				navigate('/home');
			} else {
				setError('Password not matched.');
			}
		}
		setTimeout(() => {
			setError('');
		}, 4000);
	}

	return (
		<div>
			{
				login ? (
					<div className='signin'>
						<h3>Please ! Login here</h3>
						<input
							type="email"
							name='email'
							value={email}
							className='signininput authInput'
							placeholder="Enter Email"
							onChange={(e) => handleChange(e)}
						/>
						<input
							type="password"
							name='password'
							value={password}
							className='signininput authInput'
							placeholder="Enter Password"
							onChange={(e) => handleChange(e)}
						/>
						{error !== '' && <span style={{ color: 'red' }}>{error}</span>}
						<button className='signingbtn' onClick={handleSignIn}>
							Sign In
						</button>
						<div className='signup'>
							<p onClick={() => handleFormChange()}> Sign Up</p>
						</div>
					</div>

				) : (
					<div className='signin'>
						<h3>Please ! Signup here</h3>
						<input
							type="text"
							name='name'
							value={name}
							className="signininput authInput"
							placeholder="Enter Name"
							onChange={(e) => handleChange(e)}
						/>
						<input
							type="email"
							name='email'
							value={email}
							className='signininput authInput'
							placeholder="Enter Email"
							onChange={(e) => handleChange(e)}
						/>
						<input
							type="password"
							name='password'
							value={password}
							className='signininput authInput'
							placeholder="Create Password"
							onChange={(e) => handleChange(e)}
						/>
						{error && <span style={{ color: 'red' }}>{error}</span>}
						<button className='signingbtn' onClick={handleSignUp}>
							Sign Up
						</button>
						<div className='signup'>
							<p onClick={() => handleFormChange()}> Sign In</p>
						</div>
					</div>
				)
			}
		</div>
	)
}

export default Auth