@bookstore
Feature: Book Store — end-to-end user flow via API

  Background:
    * url baseUrl
    * def timestamp = java.lang.System.currentTimeMillis()
    * def randomSuffix = Math.floor(Math.random() * 10000)
    * def userName = 'karate_test_' + timestamp + '_' + randomSuffix
    * def password = testPassword
    * def bookIsbn = '9781449325862'

  Scenario: User can register, log in, add a book, view it, delete it, and log out
    Given path 'Account', 'v1', 'User'
    And request { userName: '#(userName)', password: '#(password)' }
    When method POST
    Then status 201
    And match response.username == userName
    And match response.userID == '#string'
    * def userID = response.userID

    Given path 'Account', 'v1', 'GenerateToken'
    And request { userName: '#(userName)', password: '#(password)' }
    When method POST
    Then status 200
    And match response.status == 'Success'
    And match response.result == 'User authorized successfully.'
    * def token = response.token

    Given path 'Account', 'v1', 'Authorized'
    And request { userName: '#(userName)', password: '#(password)' }
    When method POST
    Then status 200
    And match response == 'true'

    Given path 'BookStore', 'v1', 'Books'
    And header Authorization = 'Bearer ' + token
    And request { userId: '#(userID)', collectionOfIsbns: [{ isbn: '#(bookIsbn)' }] }
    When method POST
    Then status 201
    And match response.books[0].isbn == bookIsbn

    Given path 'Account', 'v1', 'User', userID
    And header Authorization = 'Bearer ' + token
    When method GET
    Then status 200
    And match response.username == userName
    And match response.books[*].isbn contains bookIsbn

    Given path 'BookStore', 'v1', 'Book'
    And header Authorization = 'Bearer ' + token
    And request { isbn: '#(bookIsbn)', userId: '#(userID)' }
    When method DELETE
    Then status 204

    # Verify the collection is now empty
    Given path 'Account', 'v1', 'User', userID
    And header Authorization = 'Bearer ' + token
    When method GET
    Then status 200
    And match response.books == []

    Given path 'Account', 'v1', 'User', userID
    And header Authorization = 'Bearer ' + token
    When method DELETE
    Then status 204

    Given path 'Account', 'v1', 'User', userID
    And header Authorization = 'Bearer ' + token
    When method GET
    Then status 401
