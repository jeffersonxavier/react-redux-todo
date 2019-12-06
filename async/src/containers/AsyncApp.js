import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { invalidateSubreddit, selectSubreddit, fetchPostsIfNeeded } from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

const AsyncApp = ({ dispatch, selectedSubreddit, posts, isFetching, lastUpdated }) => {
  
  useEffect(() => {
    dispatch(fetchPostsIfNeeded(selectedSubreddit));
  }, [dispatch, selectedSubreddit]);

  const handleChange = (nextSubreddit) => {
    dispatch(selectSubreddit(nextSubreddit));
    dispatch(fetchPostsIfNeeded(nextSubreddit));
  };
  const handleRefreshClick = () => {
    dispatch(invalidateSubreddit(selectedSubreddit));
    dispatch(fetchPostsIfNeeded(selectedSubreddit));
  };

  return (
    <div>
      <Picker
        value={selectedSubreddit}
        onChange={handleChange}
        options={['reactjs', 'frontend']}
      />
      <p>
        {lastUpdated && (
          <span>
            Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}
          </span>
        )}
        {!isFetching && (
          <button onClick={handleRefreshClick}>Refresh</button>
        )}
      </p>
      {isFetching && posts.length === 0 && <h2>Loading...</h2>}
      {!isFetching && posts.length === 0 && <h2>Empty.</h2>}
      {posts.length > 0 && (
        <div style={{ opacity: isFetching ? 0.5 : 1 }}>
          <Posts posts={posts} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { selectedSubreddit, postsBySubreddit } = state;
  const { isFetching, lastUpdated, items: posts } =
    postsBySubreddit[selectedSubreddit] ||
    { isFetching: true, items: [] };

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated
  };
}


export default connect(mapStateToProps)(AsyncApp);
