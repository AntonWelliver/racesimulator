import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import RaceListScreen from './screens/RaceListScreen'
import ParameterScreen from './screens/ParameterScreen'

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Container>
          <Route path='/' component={RaceListScreen} exact />
          <Route path='/parameters' component={ParameterScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
