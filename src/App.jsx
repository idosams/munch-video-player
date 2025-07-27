import { Provider } from 'react-redux'
import { store } from './store'
import VideoPlayer from './components/VideoPlayer'
import styles from './App.module.scss'

function App() {
  return (
    <Provider store={store}>
      <div className={styles.app}>
        <h1>Munch Video Player</h1>
        <VideoPlayer />
      </div>
    </Provider>
  )
}

export default App
