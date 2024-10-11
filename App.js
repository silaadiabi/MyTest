import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ImageBackground,
  Image,
} from 'react-native';

// Image assets
const images = {
  bruschetta: require('./assets/Bruschetta.jpeg'),
  stuffedMushrooms: require('./assets/StuffedMushrooms.jpeg'),
  capreseSkewers: require('./assets/CapreseSkewers.jpeg'),
  grilledSalmon: require('./assets/GrilledSalmon.jpeg'),
  beefStroganoff: require('./assets/BeefStroganoff.jpeg'),
  vegetableStirFry: require('./assets/VegetableStirFry.jpeg'),
  chocolateLavaCake: require('./assets/ChocolateLavaCake.jpeg'),
  tiramisu: require('./assets/Tiramisu.jpeg'),
  fruitTart: require('./assets/FruitTart.jpeg'),
  background: require('./assets/Background.jpeg'), // Ensure you have a background image
};

const Stack = createStackNavigator();
const USD_TO_ZAR = 18;

const convertToZAR = (price) => {
  return (price * USD_TO_ZAR).toFixed(2);
};

const restaurants = [
  {
    id: '1',
    name: 'Italian Bistro',
    menu: {
      starters: [
        { item: 'Bruschetta', price: 5, image: images.bruschetta },
        { item: 'Stuffed Mushrooms', price: 6, image: images.stuffedMushrooms },
        { item: 'Caprese Skewers', price: 7, image: images.capreseSkewers },
      ],
      mains: [
        { item: 'Grilled Salmon', price: 15, image: images.grilledSalmon },
        { item: 'Beef Stroganoff', price: 12, image: images.beefStroganoff },
        { item: 'Vegetable Stir-Fry', price: 10, image: images.vegetableStirFry },
      ],
      desserts: [
        { item: 'Chocolate Lava Cake', price: 8, image: images.chocolateLavaCake },
        { item: 'Tiramisu', price: 7, image: images.tiramisu },
        { item: 'Fruit Tart', price: 6, image: images.fruitTart },
      ],
    },
  },
];

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', 'Please enter both username and password');
    }
  };

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Welcome To MANNE CACHE</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} color="#ff6347" />
        <Button title="Register" onPress={() => navigation.navigate('Register')} color="#90EE90" />
      </View>
    </ImageBackground>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (username && password) {
      Alert.alert('Success', 'You have registered successfully!');
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Register" onPress={handleRegister} color="#ff6347" />
        <Button title="Back to Login" onPress={() => navigation.goBack()} />
      </View>
    </ImageBackground>
  );
};

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground source={images.background} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to Food Ordering App</Text>
        <Button title="View Menu" onPress={() => navigation.navigate('Menu')} />
        <Button title="Logout" onPress={() => navigation.navigate('Login')} />
      </View>
    </ImageBackground>
  );
};

const MenuScreen = ({ navigation }) => {
  return (
    <ImageBackground source={images.background} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Available Restaurants</Text>
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.restaurant}>
              <Text style={styles.restaurantName}>{item.name}</Text>
              <TouchableOpacity
                style={styles.orderButton}
                onPress={() => navigation.navigate('Starter', { restaurant: item })}>
                <Text style={styles.orderButtonText}>View Menu</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const StarterScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const [order, setOrder] = useState([]);

  const addToOrder = (item) => {
    setOrder((prevOrder) => [...prevOrder, item]);
    Alert.alert('Success', `${item.item} added to your order.`);
  };

  const handleNext = () => {
    navigation.navigate('Main', { restaurant, order });
  };

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>{restaurant.name} Starters</Text>
        <FlatList
          data={restaurant.menu.starters}
          keyExtractor={(item) => item.item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addToOrder(item)} style={styles.menuItem}>
              <Image source={item.image} style={styles.menuImage} />
              <Text style={styles.menuText}>
                {item.item} - R{convertToZAR(item.price)}
              </Text>
            </TouchableOpacity>
          )}
        />
        <Button title="Next: Main Course" onPress={handleNext} />
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </ImageBackground>
  );
};

const MainScreen = ({ route, navigation }) => {
  const { restaurant, order } = route.params;

  const addToOrder = (item) => {
    Alert.alert('Success', `${item.item} added to your order.`);
    order.push(item); // consider using a state or context for better management
  };

  const handleNext = () => {
    navigation.navigate('Dessert', { restaurant, order });
  };

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>{restaurant.name} Main Courses</Text>
        <FlatList
          data={restaurant.menu.mains}
          keyExtractor={(item) => item.item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addToOrder(item)} style={styles.menuItem}>
              <Image source={item.image} style={styles.menuImage} />
              <Text style={styles.menuText}>
                {item.item} - R{convertToZAR(item.price)}
              </Text>
            </TouchableOpacity>
          )}
        />
        <Button title="Next: Desserts" onPress={handleNext} />
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </ImageBackground>
  );
};

const DessertScreen = ({ route, navigation }) => {
  const { restaurant, order } = route.params;

  const addToOrder = (item) => {
    Alert.alert('Success', `${item.item} added to your order.`);
    order.push(item); // consider using a state or context for better management
  };

  const handleBasket = () => {
    navigation.navigate('Basket', { order });
  };

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>{restaurant.name} Desserts</Text>
        <FlatList
          data={restaurant.menu.desserts}
          keyExtractor={(item) => item.item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addToOrder(item)} style={styles.menuItem}>
              <Image source={item.image} style={styles.menuImage} />
              <Text style={styles.menuText}>
                {item.item} - R{convertToZAR(item.price)}
              </Text>
            </TouchableOpacity>
          )}
        />
        <Button title="Go to Basket" onPress={handleBasket} />
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </ImageBackground>
  );
};

const BasketScreen = ({ route, navigation }) => {
  const { order } = route.params;

  const total = order.reduce((sum, item) => sum + parseFloat(convertToZAR(item.price)), 0);

  const handleCheckout = () => {
    Alert.alert('Order Placed', `Your total is R${total}. Thank you!`);
    navigation.navigate('Home');
  };

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Order</Text>
        <FlatList
          data={order}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <Image source={item.image} style={styles.menuImage} />
              <Text style={styles.menuText}>
                {item.item} - R{convertToZAR(item.price)}
              </Text>
            </View>
          )}
        />
        <Text style={styles.header}>Total: R{total.toFixed(2)}</Text>
        <Button title="Checkout" onPress={handleCheckout} />
        <Button title="Back to Menu" onPress={() => navigation.goBack()} />
      </View>
    </ImageBackground>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Starter" component={StarterScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Dessert" component={DessertScreen} />
        <Stack.Screen name="Basket" component={BasketScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  restaurant: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#ff6347',
    borderRadius: 5,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderButton: {
    backgroundColor: '#90EE90',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  orderButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuImage: {
    width: 50, 
    height: 50,
    marginRight: 10,
  },
});
