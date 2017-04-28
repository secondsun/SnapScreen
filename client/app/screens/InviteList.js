import React from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ListView,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {
  Body,
  Container,
  Content,
  Icon,
  Fab,
  Left,
  ListItem,
  Right,
  Text,
  Thumbnail,
  variables,
} from 'native-base';
import { getInvites } from '../api';
import { formatShowtime } from '../utils';

// XXX: Eliminate this when we can get the ID from Keycloak
const currentUserID = 'pdarrow@example.com';

const styles = {
  accepted: {
    color: variables.brandSuccess,
  },
  declined: {
    color: variables.brandDanger,
  },
  unanswered: {
    color: 'gray',
  },
  organizer: {
    color: variables.brandInfo,
  },
  thumbnail: {
    width: 60,
    height: 90,
  },
  listArrow: {
    flex: 0.1,
  },
  addButton: {
    backgroundColor: '#037aff',
  },
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCurrentUserStatus(invitees) {
  try {
    return invitees.find(user => user.id === currentUserID).status;
  } catch (ignore) {
    return 'Not Invited'; //While we have test data it may be possible that you get wrong invitations.
  }
}

export default class InviteListScreen extends React.Component {
  static navigationOptions = {
    title: 'Invites',
  };
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = { refreshing: false };

    // Initial load of invites
    getInvites()
      .then(invites => {
        this.setState({ dataSource: ds.cloneWithRows(invites) });
      })
      .catch(error => {
        alert('Error loading invites: ' + JSON.stringify(error));
      });
  }
  _renderRow(item) {
    return (
      <ListItem
        onPress={() =>
          this.props.navigation.navigate('InviteDetail', { invite: item })}
      >
        <Image
          source={{ uri: item.movie.thumbnail }}
          style={styles.thumbnail}
        />
        <Body>
          <Text>{item.movie.title}</Text>
          <Text note>{formatShowtime(item.showtime.time)}</Text>

          <Choose>
            <When condition={item.organizer.id === currentUserID}>
              <Text note style={styles.organizer}>Organizer</Text>
            </When>
            <Otherwise>
              <Text note style={styles[getCurrentUserStatus(item.invitees)]}>
                {capitalize(getCurrentUserStatus(item.invitees))}
              </Text>
            </Otherwise>
          </Choose>

        </Body>
        <Right style={styles.listArrow}>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  }
  _refreshData() {
    this.setState({ refreshing: true });
    getInvites()
      .then(invites => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(invites),
          refreshing: false,
        });
      })
      .catch(error => {
        console.log('Error refreshing invites.');
      });
  }
  render() {
    if (this.state.dataSource) {
      // TODO: Replace with FlatList when we upgrade to react-native >= 0.43
      return (
        <Container>
          <Content>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._refreshData.bind(this)}
                />
              }
            />
          </Content>
          {/* TODO: This button needs something like TouchableOpacitiy -
              there's no feedback when it's pressed. */}
          <Fab
            style={styles.addButton}
            onPress={() => this.props.navigation.navigate('InviteCreate')}
          >
            <Icon name="add" />
          </Fab>
        </Container>
      );
    } else {
      return (
        <Container>
          <Content>
            <ActivityIndicator
              animating={this.state.animating}
              style={[styles.centering, { height: 80 }]}
              size="large"
            />
          </Content>
        </Container>
      );
    }
  }
}
