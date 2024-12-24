import './components.css';
import sampleImage3 from '../assets/sample.png';
import PropTypes from 'prop-types';


function Navbar({ onLogout }) {

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img
          src={sampleImage3}
          alt="Sign Up Illustration"
          className="signup-image2  navchild_image "
        />
        <div className='navchild'>
          Note Plus
        </div>
      </div>
      <div className="navbar-menu">
        <button
          className="navbar-button logout"
          onClick={onLogout}
          style={{ fontSize: '16px', padding: '8px 16px', backgroundColor: 'gold', borderRadius: '10px' }}
        >
          Back to Home
        </button>
      </div>
    </nav>
  );
}
Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;