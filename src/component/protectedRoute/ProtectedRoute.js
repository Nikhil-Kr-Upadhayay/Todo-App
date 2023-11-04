import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
	const navigate = useNavigate()
	const [userDetail, setUserDetail] = useState(JSON.parse(localStorage.getItem('loggedInUser')));

	if (userDetail == null) {
		navigate('/login')
	}
	return children

};

export default ProtectedRoute;