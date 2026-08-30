package bookstore;

import com.intuit.karate.junit5.Karate;

class BookStoreRunnerTest {

    @Karate.Test
    Karate bookStoreFlow() {
        return Karate.run("BookStoreFlow").relativeTo(getClass());
    }
}