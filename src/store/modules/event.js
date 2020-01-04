import EventService from "@/services/EventService.js";
export const namespaced = true;
export const state = {
  events: [],
  eventsTotal: 0,
  event: {}
};
export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event);
  },
  SET_EVENTS(state, events) {
    state.events = events;
  },
  SET_TOTAL_EVENTS(state, totalEvents) {
    state.eventsTotal = totalEvents;
  },
  SET_EVENT(state, event) {
    state.event = event;
  }
};
export const actions = {
  createEvent({ commit, rootState, dispatch }, event) {
    console.log("User creating an event is" + rootState.user.user.name);
    return EventService.postEvent(event)
      .then(() => {
        commit("ADD_EVENT", event);
        const notification = {
          type: "success",
          message: "Your event has been created!"
        };
        dispatch("notification/add", notification, {
          root: true
        });
      })
      .catch(error => {
        const notification = {
          type: "error",
          message: "There was a problem creating your event: " + error.message
        };
        dispatch("notification/add", notification, { root: true });
        throw error;
      });
  },
  fetchEvents({ commit, dispatch }, { perPage, page }) {
    EventService.getEvents(perPage, page)
      .then(response => {
        commit("SET_TOTAL_EVENTS", parseInt(response.headers["x-total-count"]));
        commit("SET_EVENTS", response.data);
      })
      .catch(error => {
        const notification = {
          type: "error",
          message: "There was an error fetching events" + error.response
        };
        dispatch("notification/add", notification, { root: true });
      });
  },
  fetchEvent({ commit, getters, dispatch }, id) {
    var event = getters.getEventById(id);
    if (event) {
      commit("SET_EVENT", event);
    } else {
      EventService.getEvent(id)
        .then(response => {
          commit("SET_EVENT", response.data);
        })
        .catch(error => {
          const notification = {
            type: "error",
            message: "There was a problem fetching an event: " + error.message
          };
          dispatch("notification/add", notification, {
            root: true
          });
        });
    }
  }
};
export const getters = {
  getEventById: state => id => {
    return state.events.find(event => event.id === id);
  }
  //   categoriesLength: state => state.categories.length
};
