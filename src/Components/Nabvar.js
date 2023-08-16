import { Link } from "react-router-dom";
import '../Styles/Chatbot.css'
import {  unAuthorized } from "../Slice/signSlice";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { clearToken } from "../Utils/Requests";
import React from 'react';

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSignOut = useCallback (() => {
    clearToken();
    dispatch(unAuthorized());
  }, [dispatch]);

  return (
    <nav class="navbar navbar-light py-2 border-bottom">
      <div class="container d-flex flex-wrap">
        {auth.isAuthorized && (
          <ul class="nav me-auto">
              <li class="nav-item">
                <Link
                  to="/"
                  class="nav-link link-dark px-3 active"
                  aria-current="page"
                >
                  Dashboard 
                </Link>
              </li>
              <li class="nav-item d-inline">
                <Link
                  to="/"
                  class="nav-link link-dark px-3 active"
                  aria-current="page"
                >
                  Chat history
                </Link>
              </li>
              <li class="nav-item d-inline">
                <Link
                  to="/"
                  class="nav-link link-dark px-3 active"
                  aria-current="page"
                >
                  Statistics
                </Link>
              </li>
          </ul>
        )}
        <ul class="nav px-5" style ={{ marginLeft: "auto" }}>
          {!auth.isAuthorized ? (
            <>
              <li class="nav-item d-inline">
                <Link
                  to="/signin"
                  class="nav-link link-dark px-3 active"
                  aria-current="page"
                >
                  Sign in
                </Link>
              </li>
              <li class="nav-item d-inline ">
                <Link
                  to="/signup"
                  class="nav-link link-dark px-3 active"
                  aria-current="page"
                >
                  Sign up
                </Link>
              </li>
            </>
          ) : (
            <li class="nav-item d-inline ">
              <Link
                to="/signin"
                class="nav-link link-dark px-3 active"
                aria-current="page"
                onClick={handleSignOut}
              >
                Sign out
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar;