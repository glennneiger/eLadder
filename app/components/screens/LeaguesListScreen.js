import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import { ActivityIndicator } from "react-native";
import LeaguesList from "../base/LeaguesList";
import AddLeagueFromLink from "../base/AddLeagueFromLink.js";
import LEAGUES from "../../graphql/Leagues.js";
import LEAGUE_IDS from "../../graphql/LeagueIds";

class LeaguesListScreen extends Component {
  static navigationOptions = {
    title: "Leagues"
  };

  _openLeague(leagueId, allLeagues) {
    if (this.props.navigation.isFocused()) {
      const league = allLeagues.find(league => league.id === leagueId);
      this.props.navigation.navigate("League", {
        leagueId,
        leagueTitle: league.title
      });
    }
  }

  _openCreateLeague() {
    this.props.navigation.navigate("CreateLeague");
  }

  _openLeaguesList() {
    this.props.navigation.navigate("LeaguesList");
  }

  render() {
    return (
      <Query query={LEAGUE_IDS}>
        {({ data }) => {
          if (!data.leagueIds)
            return <ActivityIndicator style={{ marginTop: 40 }} />;

          const leagueIds = data.leagueIds;
          return (
            <Query
              query={LEAGUES}
              variables={{ leagueIds }}
              fetchPolicy="cache-and-network"
            >
              {({ loading, error, data, refetch, networkStatus }) => {
                let content;
                if (!data || data.loading) {
                  content = <ActivityIndicator style={{ marginTop: 40 }} />;
                } else {
                  content = (
                    <Fragment>
                      <AddLeagueFromLink
                        leagueIds={leagueIds}
                        openLeague={id => this._openLeague(id, data.leagues)}
                        openLeaguesList={() =>
                          this._openLeaguesList(data.leagues)
                        }
                      />
                      <LeaguesList
                        leagues={data.leagues}
                        openLeague={id => this._openLeague(id, data.leagues)}
                        openCreateLeague={() => this._openCreateLeague()}
                        refreshing={networkStatus === 4}
                        refetch={refetch}
                      />
                    </Fragment>
                  );
                }

                return content;
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export default LeaguesListScreen;