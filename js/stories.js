"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="far fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/**Submit a new story and show the new story on the page. */

async function addNewStoryAndShow(evt) {
  evt.preventDefault();
  const storyAuthor = $("#story-author").val();
  const storyTitle = $("#story-title").val();
  const storyUrl = $("#story-url").val();
  
  await storyList.addStory(currentUser, {
    "author": storyAuthor, 
    "title": storyTitle,
    "url": storyUrl,
  });

  $newStory.hide();
  $newStory.trigger("reset");
  putStoriesOnPage();
}

$newStory.on("submit", addNewStoryAndShow);

/**iterate through user favorites stories list and append to the DOM */
function showFavorites(){
  console.log('123', currentUser.favorites);
  $allFavoritesStoriesList.empty();
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allFavoritesStoriesList.append($story);
  }
}

async function favoritesIconClick(evt) {
  console.debug("favoritesIconClick", evt);

  //if isFas true, it is a favorite story
  const isFas = $(evt.target).hasClass("fas");
  let storyId = $(evt.target).closest("li").attr("id");

  let story = storyList.stories.find(story => story.storyId === storyId);
  
  $(evt.target).toggleClass("fas");
  if (isFas) {
    await currentUser.unFavorite(story);
  } else {
    await currentUser.addFavorite(story);
  }
}

$("body").on("click", ".fa-star", favoritesIconClick);