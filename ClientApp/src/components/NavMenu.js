import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import {Link, Navigate} from 'react-router-dom';
import './NavMenu.css';
import Routes from './Constants/Routes';
import SessionsRemote from "./Constants/flux/remote/SessionsRemote";
import Swal from "sweetalert2";

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      validSessionPresent: false,
      authorizedForAdminPanels: false,
      navigateToLogin: false,
      intervalId: null
    };
  }
  
  componentDidMount() {
    let intervalId = setInterval(() => this.checkPermissions(), 500);
    this.setState({ intervalId: intervalId });
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.navigateToLogin && this.state.navigateToLogin) {
      this.render();
      this.setState({ navigateToLogin: false });
    }
  }
  
  checkPermissions = () => {
    let session = window.localStorage.getItem("hydroFlowSession");
    if (session !== null) {
      SessionsRemote.validateSession(session, (status) => {
        if (status) {
          this.setState({validSessionPresent: true}, () => {
            let sessionData = JSON.parse(session);
            this.setState({
              authorizedForAdminPanels: sessionData && sessionData.allowedRole && sessionData.allowedRole === "sysadmin",
            }, () => {
              clearInterval(this.state.intervalId);
              this.render();
            })
          });
        } else {
          window.localStorage.removeItem("hydroFlowSession");
          SessionsRemote.logoutUser(session).then(response => {
            Swal.fire({
              title: "Session Expired",
              text: `Your session has expired!`,
              icon: "warning"
            }).then(() => {
              this.setState({
                validSessionPresent: false,
                authorizedForAdminPanels: false
              });
            });
          });
        }
        this.render();
      });
    }
  }

  logout = () => {
    let session = window.localStorage.getItem("hydroFlowSession");
    SessionsRemote.logoutUser(session).then(response => {
      if (response.status === 404) {
        console.log("no session found with this user to log out");
      } else if (response.status === 200) {
        window.localStorage.removeItem("hydroFlowSession");
        this.setState({
          validSessionPresent: false,
          navigateToLogin: true 
        });
      }
    });
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  
  getNavBar = () => {
    return <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
        <NavbarBrand tag={Link} to="/">HydroFlowProject</NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
          <ul className="navbar-nav flex-grow">
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
            </NavItem>
			{
				this.state.validSessionPresent ? <>
					<NavItem>
						<NavLink tag={Link} className="text-dark" to={Routes.CalibrationPage.route}>Calibration</NavLink>
					</NavItem>
          <NavItem>
						<NavLink tag={Link} className="text-dark" to={Routes.OptimizationPage.route}>Optimization</NavLink>
					</NavItem>
				</> : <></>
			}
            {
              (this.state.validSessionPresent && this.state.authorizedForAdminPanels) ?
                  <>
                    <NavItem>
                      <NavLink tag={Link} className="text-dark" to={Routes.BasinsAdminPanel.route}>Basins</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} className="text-dark" to={Routes.UsersAdminPanel.route}>Users</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} className="text-dark" to={Routes.ModelsAdminPanel.route}>Models</NavLink>
                    </NavItem>
                  </>
                  : <></>
            }
            {
              !this.state.validSessionPresent ? <>
                <NavItem>
                  <NavLink tag={Link} className={"text-dark"} to={Routes.LoginPage.route}>Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className={"text-dark"} to={Routes.RegisterPage.route}>Register</NavLink>
                </NavItem>
              </> : <>
                <button
                    className={"btn btn-secondary"}
                    onClick={this.logout}
                >Logout</button>
              </>
            }
          </ul>
        </Collapse>
      </Navbar>
    </header>
  }

  render() {
    return this.state.navigateToLogin ? (
        <>
          {this.getNavBar()}
          <Navigate to={"/login"}/>
        </>
    ) : this.getNavBar();
  }
}
