import cookie from 'react-cookies'

export function tokenExpiration( message ) {
  if ( message === "JWT Error raised" ) {
    cookie.remove( 'user' );
    return true
  }
  return false
}