import React from 'react'
import { FlatList, ActivityIndicator, Text, TouchableHighlight, Alert, SafeAreaView, View, StyleSheet, Image } from 'react-native'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import Flag from 'react-native-round-flags'
import Modal from 'react-native-modal'

export default class FetchExample extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isLoading: true,
      exchangeRate: [],
      baseCurrencyLit: '',
      currentDate: new Date(),
      currency: {},
      baseCurrency: '',
      day: {},
      datejs: {},
      date: '',
      markedDate: moment(new Date()).format('DD.MM.YYYY'),
      maxday: '',
      modalVisible: false
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  componentDidMount() {
    const js = 'https://api.privatbank.ua/p24api/exchange_rates?json&date='
    const a = this.state.exchangeRate
    console.log(a)
    const today = this.state.currentDate
    console.log(today)
    const day = moment(today).format('dddd')
    console.log(day)
    const date = moment(today).format('DD.MM.YYYY')
    console.log(date)
    console.log(js + date)
    const njs = js + date
    console.log(njs)
    const maxday = moment(day.dateString).format('YYYY-MM-DD')
    console.log(maxday)
    this.setState({ maxday })
    this.refreshRates(njs)
  }

  refreshRates(link) {
    fetch(link)
      .then(response => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          isLoading: false,
          exchangeRate: responseJson.exchangeRate,
          date: responseJson.date,
          baseCurrencyLit: responseJson.baseCurrencyLit
        }, () => {
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  renderModalContent = () => (
    <View style={styles.calendar} pointerEvents={'none'}>

      <Calendar
        onDayPress={(day) => {
          this.setState({ isLoading: true })
          const js = 'https://api.privatbank.ua/p24api/exchange_rates?json&date='
          const day333 = moment(day.dateString).format('DD.MM.YYYY')
          console.log(day333)
          const datejs = js + day333
          console.log(datejs)
          this.refreshRates(datejs)
          this.setModalVisible(!this.state.modalVisible)
        }}
        minDate=" 01.09.2009 "
        maxDate={this.state.maxday}
        markedDates={{
          '12.06.2019': {
            periods: [
              { startingDay: false, endingDay: true, color: '#5f9ea0' },
              { startingDay: false, endingDay: true, color: '#ffa500' },
              { startingDay: true, endingDay: false, color: '#f0e68c' }
            ]
          },
          '12.06.2019': {
            periods: [
              { startingDay: true, endingDay: false, color: '#ffa500' },
              { color: 'transparent' },
              { startingDay: false, endingDay: false, color: '#f0e68c' }
            ]
          }
        }}
        markingType="multi-period"
      />
      <TouchableHighlight
        onPress={() => {
          this.setModalVisible(!this.state.modalVisible)
        }}
      >
        <Text style={styles.closetext}>CLOSE Hide Modal</Text>
      </TouchableHighlight>
    </View>
  );

    handleOnScroll = (event) => {
      this.setState({
        scrollOffset: event.nativeEvent.contentOffset.y
      })
    };

    handleScrollTo = (p) => {
      if (this.scrollViewRef) {
        this.scrollViewRef.scrollTo(p)
      }
    }

    render() {
      console.log('state', this.state.exchangeRate)
      return (
        <SafeAreaView style={styles.container}>
          <Modal
            onBackdropPress={() => this.setState({ modalVisible: null })}
            animationType="slide"
            transparent
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.')
            }}
          >
            {this.renderModalContent()}
          </Modal>
          <View style={{ backgroundColor: 'red ' }}>
            {console.log(this.state.date)}
            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(true)
              }}
            >
              <Text style={{ backgroundColor: 'green', fontSize: 20, padding: 10, marginBottom: 5, color: 'white', fontWeight: 'bold', justifyContent: 'center' }}> {
                <Icon
                  name="calendar"
                  size={20}
                  color="white"
                />
      }  Calendar
              </Text>
            </TouchableHighlight>
            <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
              <View style={{ alignContent: 'center', backgroundColor: 'transparent', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', justifyContent: 'center' }}> {this.state.date}</Text>
              </View>
              <View style={{ }}>
                <Text><Flag code="UA" /> </Text>
              </View>
            </View>
          </View>
          {!this.state.isLoading && (
          <FlatList
            data={this.state.exchangeRate}
            style={{ alignSelf: 'stretch' }}
            renderItem={({ item }) => (
              <View style={styles.flag}>
                <View style={{ paddingHorizontal: 10 }}>
                  {console.log(item.currency)}
                  { item.currency &&
                  <Text> <Flag code={item.currency.slice(0, -1)} /></Text>
              }
                </View>
                { item.currency && (
                <View style={styles.body}>
                  <Text style={styles.bodytext}>
                     1 {item.currency}  = {item.saleRateNB} {this.state.baseCurrencyLit}
                  </Text>
                  <Text style={styles.bodytext}>
                                                           on data {this.state.date}
                  </Text>
                </View>
                )}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          )}
          {this.state.isLoading && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
          )}
        </SafeAreaView>
      )
    }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center'
  },
  closetext: {
    fontSize: 20,
    paddingTop: 100,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  calendar: {
    flex: 1,
    margin: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    // shadowOffset: {
    // width: 100,
    // height: 12
    // },
    shadowOpacity: 0.58,
    shadowRadius: 16.00
  },
  bodytext: { fontSize: 18,
    backgroundColor: 'transparent',
    alignContent: 'center',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  body: {
    alignContent: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  flag: { borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    flexDirection: 'row',
    backgroundColor: 'transparent'
  }

})
