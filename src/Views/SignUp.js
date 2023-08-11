import '../Styles/SignUp.css'
import { sendRequestsWithToken } from '../Utils/Requests';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export default function SignUp(){
  const navigator = useNavigate();

  const handleSubmit = useCallback((ev) => {
    ev.preventDefault();
    const formdata = new FormData(ev.target);
    sendRequestsWithToken('auth/signup', {
      body: formdata
    })
      .then((response) => {
        const result = response.json();
        console.log(result);
        if(response.status === 200){
          alert("You Signed Up Successfully");
          navigator('/signin');
        }
        else alert("Unknown Error");
      })
      .catch((err) => {
        alert("Failed for reason");
      })
  }, [])

  return(
    <section className="text-center text-lg-start">
      <div className="container py-4">
        <div className="row g-0 align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="card cascading-right" style={{
                background: "hsla(0, 0%, 100%, 0.55)",
                backdropFilter: "blur(30px)"
            }}>
              <div className="card-body p-5 shadow-5 text-center">
                <h2 className="fw-bold mb-5">Sign up now</h2>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <input type="text" id="form3Example1" className="form-control" name="firstname" />
                        <label className="form-label" for="form3Example1">First name</label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <input type="text" id="form3Example2" className="form-control" name="lastname" />
                        <label className="form-label" for="form3Example2">Last name</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-outline mb-4">
                    <input type="email" id="form3Example3" className="form-control" name="email" />
                    <label className="form-label" for="form3Example3">Email address</label>
                  </div>

                  <div className="form-outline mb-4">
                    <input type="password" id="form3Example4" className="form-control" name="password" />
                    <label className="form-label" for="form3Example4">Password</label>
                  </div>

                  <div className="form-outline mb-4">
                    <input type="confirm_password" id="form3Example5" className="form-control" name="confirm_password" />
                    <label className="form-label" for="form3Example5">Confirm Password</label>
                  </div>

                  <div className="form-check d-flex justify-content-center mb-4">
                    <input className="form-check-input me-2" type="checkbox" value="" id="form2Example33" />
                    <label className="form-check-label" for="form2Example33">
                      Subscribe to our newsletter
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block mb-4">
                    Sign up
                  </button>

                  <div className="text-center">
                    <p>or sign up with:</p>
                    <button type="button" className="btn btn-link btn-floating mx-1">
                      <i className="fab fa-facebook-f"></i>
                    </button>

                    <button type="button" className="btn btn-link btn-floating mx-1">
                      <i className="fab fa-google"></i>
                    </button>

                    <button type="button" className="btn btn-link btn-floating mx-1">
                      <i className="fab fa-twitter"></i>
                    </button>

                    <button type="button" className="btn btn-link btn-floating mx-1">
                      <i className="fab fa-github"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-5 mb-lg-0">
            <img src="../Images/004.jpg" className="w-100 rounded-4 shadow-4"
              alt="" />
          </div>
        </div>
      </div>
    </section>
  )
}