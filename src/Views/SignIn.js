import '../Styles/SignIn.css'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { sendRequestsWithToken, setToken } from '../Utils/Requests';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../Slice/signSlice'

export default function SignIn(){
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = useCallback((ev) => {
    ev.preventDefault();
    const formdata = new FormData(ev.target);

    sendRequestsWithToken("auth/signin", {
      body: formdata,
    })
      .then(async (response) => {
        const result = await response.json();
        console.log(result['username']);
        if(response.status === 200){
          alert("You Signed In Successfully");
          setToken(result.access_token);
          dispatch(
            setAuthorized({user: result.user})
          );
          navigator("/");
        }
        else alert("Unknown Error");
      })
      .catch((err) => {
        alert("Failed for reason");
      })
  }, [dispatch, navigator])

  return(
    <section className=" text-center text-lg-start"> 
      <div className="card mb-3">
        <div className="row g-0 d-flex align-items-center">
          <div className="col-lg-4 d-none d-lg-flex">
            <img src="/Images/004.jpg" alt="Trendy Pants and Shoes"
              className="w-100 rounded-t-5 rounded-tr-lg-0 rounded-bl-lg-5" />
          </div>
          <div className="col-lg-8">
            <div className="card-body py-5 px-md-5">

              <form onSubmit={handleSubmit}>
                <div class="form-outline mb-4">
                  <input type="email" id="form2Example1" className="form-control active" name="email" />
                  <label class="form-label" for="form2Example1">Email address</label>
                  <div class="form-notch"><div class="form-notch-leading" style={{width: "9px"}}></div><div class="form-notch-middle" style={{width: "85px"}}></div><div class="form-notch-trailing"></div></div>
                </div>
                <div class="form-outline mb-4">
                  <input type="password" id="form2Example2" className="form-control active" name="password" />
                  <label class="form-label" for="form2Example2">Password</label>
                  <div class="form-notch"><div class="form-notch-leading" style={{width: "9px"}}></div><div class="form-notch-middle" style={{width: "60px"}}></div><div class="form-notch-trailing"></div></div>
                </div>

                <div className="row mb-4">
                  <div className="col d-flex justify-content-center">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="" id="form2Example31" />
                      <label className="form-check-label" for="form2Example31"> Remember me </label>
                    </div>
                  </div>

                  <div className="col">
                    <a href="#!">Forgot password?</a>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>

              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}