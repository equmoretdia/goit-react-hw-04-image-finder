import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import css from './App.module.css';
import Searchbar from './Searchbar';
import Loader from './Loader';
import ImageGallery from './ImageGallery';
import Button from './Button';
import api from '../services/api';

export default function App() {
  const [state, setState] = useState({
    searchQuery: '',
    pendingRequest: false,
    page: 1,
    picturesSet: [],
    searchMatches: 0,
    totalHits: 0,
  });

  const {
    searchQuery,
    pendingRequest,
    page,
    picturesSet,
    searchMatches,
    totalHits,
  } = state;

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    setState(prevState => ({ ...prevState, pendingRequest: true }));
    api(searchQuery, page)
      .then(pictures => {
        setState(prevState => ({
          ...prevState,
          pendingRequest: false,
          picturesSet: [...prevState.picturesSet, ...pictures.hits],
          searchMatches: prevState.searchMatches + pictures.hits.length,
          totalHits: pictures.totalHits,
        }));
        setState(prevState => {
          console.log(
            `we have loaded ${prevState.searchMatches} out of ${prevState.totalHits} totally found`
          );
          if (prevState.totalHits > 0 && prevState.page === 1) {
            toast.success(`Hooray! We found ${prevState.totalHits} images`, {
              position: 'top-right',
              theme: 'colored',
            });
          } else if (
            prevState.searchMatches === prevState.totalHits &&
            prevState.totalHits > 0
          ) {
            toast.info("You've reached the end of search results.", {
              position: 'top-right',
              theme: 'colored',
            });
          } else if (prevState.totalHits === 0) {
            toast.warn(
              'No pictures were found for your query, please try another one!',
              {
                position: 'top-right',
                theme: 'colored',
              }
            );
          }
          return prevState;
        });
      })
      .catch(error => handleError(error))
      .finally();
  }, [searchQuery, page]);

  const handleError = error => {
    setState(prevState => ({ ...prevState, pendingRequest: false }));
    console.log('An error occurred: ', error.message);
    toast.error(`An error occurred: ${error.message}`, {
      position: 'top-right',
      theme: 'colored',
    });
  };

  const handleQuery = query => {
    if (query === searchQuery) {
      toast.warn(
        `You are searching through the collection for "${query}" already!`,
        {
          position: 'top-right',
          theme: 'colored',
        }
      );
    }
    setState(prevState => ({
      ...prevState,
      searchQuery: query,
      page: 1,
      picturesSet: [],
      searchMatches: 0,
      totalHits: 0,
    }));
  };

  const loadMorePictures = () => {
    setState(prevState => ({ ...prevState, page: prevState.page + 1 }));
  };

  return (
    <div className={css.App}>
      <Searchbar onSubmit={handleQuery} />
      {picturesSet.length > 0 && <ImageGallery pictures={picturesSet} />}
      {pendingRequest && <Loader />}
      {searchMatches < totalHits && <Button onClick={loadMorePictures} />}

      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}
