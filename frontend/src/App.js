import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import RaceListScreen from './screens/RaceListScreen'
import RaceParameterScreen from './screens/RaceParameterScreen'
import EntryParameterScreen from './screens/EntryParameterScreen'
import StartListScreen from './screens/StartListScreen'

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Container>
          <Route path='/' component={RaceListScreen} exact />
          <Route path='/race-parameters/:id' component={RaceParameterScreen} />
          <Route path='/entry-parameters/:id' component={EntryParameterScreen} />
          <Route path='/startlist' component={StartListScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
