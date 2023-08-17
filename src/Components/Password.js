import '../Styles/Chatbot.css'



export const Password = ({enterPassword, resetPassword, currentPassword}) => {


  const convert_to_array = (str) => {
    const array = Array.from(str);
    for(let i = array.length; i <= 6; i ++) array.append("@");
    return array;
  }

  return (
    <div class="password">
      <div class="vue-pincode__fields mb-4">
        {
          convert_to_array(currentPassword).map((num, index) => (
            (num === '@') ? (<i class="far fa-circle"></i>) : (<i class="fas fa-circle"></i>)
          ))
        }
      </div>
      <div>
        <table class="vue-pincode__numbers">
          <tbody>
            <tr>
              <td><button class="shadow" onClick={() => enterPassword('1')}>1</button></td>
              <td><button class="shadow" onClick={() => enterPassword('2')}>2</button></td>
              <td><button class="shadow" onClick={() => enterPassword('3')}>3</button></td>
            </tr>
            <tr>
              <td><button class="shadow" onClick={() => enterPassword('4')}>4</button></td>
              <td><button class="shadow" onClick={() => enterPassword('5')}>5</button></td>
              <td><button class="shadow" onClick={() => enterPassword('6')}>6</button></td>
            </tr>
            <tr>
              <td><button class="shadow" onClick={() => enterPassword('7')}>7</button></td>
              <td><button class="shadow" onClick={() => enterPassword('8')}>8</button></td>
              <td><button class="shadow" onClick={() => enterPassword('9')}>9</button></td>
            </tr>
            <tr>
              <td><button class="shadow" onClick={() => enterPassword('0')}>0</button></td>
              <td>
                <button class="vue-pincode__undo" onClick={resetPassword}>
                  <span data-v-4cd12bba="">
                    <svg height="30px" viewBox="0 0 512 512" width="30px" xmlns="http://www.w3.org/2000/svg">
                      <path d="m154.667969 213.332031h-138.667969c-8.832031 0-16-7.167969-16-16v-138.664062c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v122.664062h122.667969c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"></path>
                      <path d="m256 512c-68.351562 0-132.628906-26.644531-180.96875-75.03125-6.253906-6.25-6.253906-16.382812 0-22.632812 6.269531-6.273438 16.402344-6.230469 22.632812 0 42.304688 42.347656 98.515626 65.664062 158.335938 65.664062 123.519531 0 224-100.480469 224-224s-100.480469-224-224-224c-105.855469 0-200.257812 71.148438-224.449219 169.171875-2.132812 8.597656-10.75 13.824219-19.371093 11.714844-8.574219-2.132813-13.800782-10.796875-11.710938-19.371094 27.691406-112.148437 135.148438-193.515625 255.53125-193.515625 141.164062 0 256 114.835938 256 256s-114.835938 256-256 256zm0 0"></path>
                    </svg>
                  </span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>    
      </div>
    </div>
  )
}