import React from 'react'
import { Query, Mutation } from 'react-apollo'
import {
  USERS_LIST_QUERY,
  DELETE_USER_MUTATION
} from '../queries/queries.graphql'
import { Button, Card, Confirm, Container, Grid } from 'semantic-ui-react'
import { Loading } from './Loading'
import { Error } from './Error'
import './index.css'

const defaultImage =
  'http://elporvenir.mx/imagenes/editorialistasPerfil/default.png'

class ListUsers extends React.Component {
  state = {
    open: false
  }

  // alternative refetchQueries
  // update = (proxy, payload) => {
  //   //payload from graphQL
  //   const { deleteUser } = payload.data
  //   //const data = userList from query
  //   const data = proxy.readQuery({ query: USERS_LIST_QUERY })
  //   //filter differents users from deleted id
  //   data.listUsers = data.listUsers.filter(user => user.id !== deleteUser.id)
  //   //rewrite userList
  //   proxy.writeQuery({ query: USERS_LIST_QUERY, data })
  // }

  openMessage = () => {
    this.setState({ open: true })
  }

  closeMessage = () => {
    this.setState({ open: false })
  }

  handleDelete = deleteUser => {
    deleteUser()
    this.setState({ open: false })
  }

  render() {
    return (
      <Query query={USERS_LIST_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />
          if (error) return <Error />
          return (
            <Container className="mt-20 mb-20">
              <Grid columns={4}>
                <Grid.Row>
                  {data.listUsers.length !== 0 ? (
                    data.listUsers.map((user, index) => (
                      <Grid.Column key={user.id}>
                        <Card
                          image={defaultImage}
                          header={user.firstname}
                          meta={user.lastname}
                          description={user.phone}
                          description={user.id}
                          extra={
                            <React.Fragment>
                              <Button style={{ float: 'left', width: '45%' }}>
                                Editar
                              </Button>
                              <Mutation
                                mutation={DELETE_USER_MUTATION}
                                variables={{ id: user.id }}
                                refetchQueries={[{ query: USERS_LIST_QUERY }]}>
                                {(deleteUser, { loading, error }) => (
                                  <div>
                                    <Button
                                      color="red"
                                      style={{ float: 'right', width: '45%' }}
                                      onClick={this.openMessage}>
                                      Eliminar
                                    </Button>
                                    <Confirm
                                      open={this.state.open}
                                      onCancel={this.closeMessage}
                                      onConfirm={() =>
                                        this.handleDelete(deleteUser)
                                      }
                                    />
                                    {loading && <Loading />}
                                    {error && <Error />}
                                  </div>
                                )}
                              </Mutation>
                            </React.Fragment>
                          }
                        />
                      </Grid.Column>
                    ))
                  ) : (
                    <h2 className="center aligned">No hay usuarios</h2>
                  )}
                </Grid.Row>
              </Grid>
            </Container>
          )
        }}
      </Query>
    )
  }
}

export default ListUsers
