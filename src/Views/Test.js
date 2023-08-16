import '../Styles/assets/scss/app.scss'
import '../Styles/assets/scss/themes/dark/app-dark.scss'

export const Test = () => {
  return (
    <div id="app">
        <div id="sidebar">

        </div>
        <div id="main" class='layout-navbar navbar-fixed'>
            <header>
                <nav class="navbar navbar-expand navbar-light navbar-top">
                    <div class="container-fluid">
                        <div  class="burger-btn d-block">
                            <i class="bi bi-justify fs-3"></i>
                        </div>

                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav ms-auto mb-lg-0">
                                <li class="nav-item dropdown me-1">
                                    <div class="nav-link active dropdown-toggle text-gray-600"  data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <i class='bi bi-envelope bi-sub fs-4'></i>
                                    </div>
                                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                        <li>
                                            <h6 class="dropdown-header">Mail</h6>
                                        </li>
                                        <li><div class="dropdown-item" >No new mail</div></li>
                                    </ul>
                                </li>
                                <li class="nav-item dropdown me-3">
                                    <div class="nav-link active dropdown-toggle text-gray-600"  data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                        <i class='bi bi-bell bi-sub fs-4'></i>
                                        <span class="badge badge-notification bg-danger">7</span>
                                    </div>
                                    <ul class="dropdown-menu dropdown-menu-end notification-dropdown" aria-labelledby="dropdownMenuButton">
                                        <li class="dropdown-header">
                                            <h6>Notifications</h6>
                                        </li>
                                        
                                        <li class="dropdown-item notification-item">
                                                <div class="notification-icon bg-success">
                                                    <i class="bi bi-file-earmark-check"></i>
                                                </div>
                                                <div class="notification-text ms-4">
                                                    <p class="notification-title font-bold">Homework submitted</p>
                                                    <p class="notification-subtitle font-thin text-sm">Algebra math homework</p>
                                                </div>
                                        </li>
                                        <li>
                                            <p class="text-center py-2 mb-0">See all notification</p>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <div class="dropdown">
                                {/* <div  data-bs-toggle="dropdown" aria-expanded="false"> */}
                                    <div class="user-menu d-flex">
                                        <div class="user-name text-end me-3">
                                            <h6 class="mb-0 text-gray-600">John Ducky</h6>
                                            <p class="mb-0 text-sm text-gray-600">Administrator</p>
                                        </div>
                                        <div class="user-img d-flex align-items-center">
                                            <div class="avatar avatar-md">
                                                {/* <img src="assets/static/images/faces/1.jpg" /> */}
                                            </div>
                                        </div>
                                    </div>
                                {/* </div> */}
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton" style={{minWidth: "11rem"}}>
                                    <li>
                                        <h6 class="dropdown-header">Hello, John!</h6>
                                    </li>
                                    <li><i class="icon-mid bi bi-person me-2"></i> My
                                            Profile</li>
                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <div id="main-content">

            </div>
        </div>
    </div>
  )
}