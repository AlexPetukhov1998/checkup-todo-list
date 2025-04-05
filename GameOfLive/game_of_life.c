#include <stdio.h>
#include <stdlib.h>
#include <sys/select.h>
#include <termios.h>
#include <unistd.h>

#define WIDTH 80
#define HEIGHT 25

#define bool int
#define true 1
#define false 0

#define BLOCK_SIZE 6

void choosePreset(int (*board)[WIDTH]);
void initializeBoardFigureBlock(int (*board)[WIDTH]);
void initializeBoardFigureOscillator(int (*board)[WIDTH]);
void initializeBoardFigureSpaceShip(int (*board)[WIDTH]);
void initializeBoardFigureGlider(int (*board)[WIDTH]);
void initializeBoardFigurePar(int (*board)[WIDTH]);
void initializeBoardRandom(int (*board)[WIDTH], unsigned int seed);
int canPlaceMatrix(int (*board)[WIDTH], int startX, int startY, int smallSize);
void clearScreen();
void printBoard(int (*board)[WIDTH]);
int countNeighbors(int (*board)[WIDTH], int x, int y);
bool updateBoard(int (*board)[WIDTH], bool *wasModified, int (*prevBoard)[WIDTH], int *iterationCount,
                 int *repeatCounter);
void mainMenu(int *timeout, int (*board)[WIDTH], int *seed);
void chooseTimeout(int *timeout);
void chooseGamemode(int (*board)[WIDTH], int *seed);
void chooseSeed(int *seed);
int kbhit(void);
void initializeBoardFromFile(int block[BLOCK_SIZE][BLOCK_SIZE], const char *filename);

int main() {
    int board[HEIGHT][WIDTH] = {0};
    int prevBoard[HEIGHT][WIDTH] = {0};
    int seed, timeout, iteration = 0;
    int counter = 0;
    int iterationCount = 0;
    int repeatCounter = 0;
    bool shouldExit = false;

    mainMenu(&timeout, board, &seed);

    while (!shouldExit && updateBoard(board, &counter, prevBoard, &iterationCount, &repeatCounter)) {
        iteration++;
        clearScreen();
        printBoard(board);
        printf("Iteration:  %d\nPress Q to exit: \n", iteration);
        fflush(stdout);

        if (kbhit()) {
            char input = getchar();
            if (input == 'q' || input == 'Q') {
                shouldExit = true;
            }
        }
        sleep(timeout);
    }

    clearScreen();
    printf("Game over!\n");
    return 0;
}

void mainMenu(int *timeout, int (*board)[WIDTH], int *seed) {
    clearScreen();
    chooseTimeout(timeout);
    chooseGamemode(board, seed);
}

void chooseTimeout(int *timeout) {
    char c;
    printf("Enter timeout between lives (sec): ");
    while (scanf("%d%c", timeout, &c) != 2 || c != '\n') {
        clearScreen();
        printf("Invalid input. Please enter a valid timeout (sec): ");
        while (getchar() != '\n');
    }
    *timeout = abs(*timeout);
}

void chooseGamemode(int (*board)[WIDTH], int *seed) {
    int choice;
    char c;
    clearScreen();
    printf("1. Randomly generated field.\n");
    printf("2. Field from presets.\n");
    printf("Choose 1 or 2: ");
    while (scanf("%d%c", &choice, &c) != 2 || (choice != 1 && choice != 2) || c != '\n') {
        clearScreen();
        printf("Invalid choice. Please choose 1 or 2.\n");
        printf("1. Randomly generated field.\n");
        printf("2. Field from presets.\n");
        while (getchar() != '\n');
    }

    if (choice == 1) {
        chooseSeed(seed);
        initializeBoardRandom(board, *seed);
    } else if (choice == 2) {
        choosePreset(board);
    }
}

void chooseSeed(int *seed) {
    clearScreen();
    *seed = rand() % 10;
}

void choosePreset(int (*board)[WIDTH]) {
    int choice;
    char c;
    clearScreen();
    printf("1. Block\n2. Blinker\n3. Beacon\n4. Glider\n5. Hive\n");
    printf("Choose 1 to 5: ");
    while (scanf("%d%c", &choice, &c) != 2 || !(choice > 0 && choice < 6) || c != '\n') {
        clearScreen();
        printf("Invalid choice. Please choose 1 to 5:\n");
        printf("1. Block\n2. Blinker\n3. Beacon\n4. Glider\n5. Hive\n");
        while (getchar() != '\n');
    }

    if (choice == 1) {
        initializeBoardFigureBlock(board);
    } else if (choice == 2) {
        initializeBoardFigureOscillator(board);
    } else if (choice == 3) {
        initializeBoardFigureSpaceShip(board);
    } else if (choice == 4) {
        initializeBoardFigureGlider(board);
    } else if (choice == 5) {
        initializeBoardFigurePar(board);
    }
}

void initializeBoardFigureBlock(int (*board)[WIDTH]) {
    int block[BLOCK_SIZE][BLOCK_SIZE];

    initializeBoardFromFile(block, "testCase1.txt");
    int startX = rand() % WIDTH;
    int startY = rand() % HEIGHT;

    if (canPlaceMatrix(board, startX, startY, BLOCK_SIZE)) {
        for (int i = 0; i < BLOCK_SIZE; ++i) {
            for (int j = 0; j < BLOCK_SIZE; ++j) {
                board[startY + i][startX + j] = block[i][j];
            }
        }
    }
}

void initializeBoardFigureOscillator(int (*board)[WIDTH]) {
    int oscillator[BLOCK_SIZE][BLOCK_SIZE];
    initializeBoardFromFile(oscillator, "testCase2.txt");

    int startX = rand() % WIDTH;
    int startY = rand() % HEIGHT;

    if (canPlaceMatrix(board, startX, startY, BLOCK_SIZE)) {
        for (int i = 0; i < BLOCK_SIZE; ++i) {
            for (int j = 0; j < BLOCK_SIZE; ++j) {
                board[startY + i][startX + j] = oscillator[i][j];
            }
        }
    }
}

void initializeBoardFigureSpaceShip(int (*board)[WIDTH]) {
    int spaceship[BLOCK_SIZE][BLOCK_SIZE];
    initializeBoardFromFile(spaceship, "testCase3.txt");

    int startX = rand() % WIDTH;
    int startY = rand() % HEIGHT;

    if (canPlaceMatrix(board, startX, startY, BLOCK_SIZE)) {
        for (int i = 0; i < BLOCK_SIZE; ++i) {
            for (int j = 0; j < BLOCK_SIZE; ++j) {
                board[startY + i][startX + j] = spaceship[i][j];
            }
        }
    }
}

void initializeBoardFigureGlider(int (*board)[WIDTH]) {
    int glider[BLOCK_SIZE][BLOCK_SIZE];
    initializeBoardFromFile(glider, "testCase4.txt");

    int startX = rand() % WIDTH;
    int startY = rand() % HEIGHT;

    if (canPlaceMatrix(board, startX, startY, BLOCK_SIZE)) {
        for (int i = 0; i < BLOCK_SIZE; ++i) {
            for (int j = 0; j < BLOCK_SIZE; ++j) {
                board[startY + i][startX + j] = glider[i][j];
            }
        }
    }
}

void initializeBoardFigurePar(int (*board)[WIDTH]) {
    int par[BLOCK_SIZE][BLOCK_SIZE];
    initializeBoardFromFile(par, "testCase5.txt");

    int startX = rand() % WIDTH;
    int startY = rand() % HEIGHT;

    if (canPlaceMatrix(board, startX, startY, BLOCK_SIZE)) {
        for (int i = 0; i < BLOCK_SIZE; ++i) {
            for (int j = 0; j < BLOCK_SIZE; ++j) {
                board[startY + i][startX + j] = par[i][j];
            }
        }
    }
}
void initializeBoardFromFile(int block[BLOCK_SIZE][BLOCK_SIZE], const char *filename) {
    FILE *file = fopen(filename, "r");
    if (file == NULL) {
        perror("Не удалось открыть файл");
        return;
    }
    for (int i = 0; i < BLOCK_SIZE; ++i) {
        for (int j = 0; j < BLOCK_SIZE; ++j) {
            if (fscanf(file, "%d", &block[i][j]) != 1) {
                fprintf(stderr, "Ошибка чтения данных из файла\n");
                fclose(file);
                return;
            }
        }
    }

    fclose(file);
}

int canPlaceMatrix(int (*board)[WIDTH], int startX, int startY, int smallSize) {
    int result = 1;
    for (int i = 0; i < smallSize; ++i) {
        for (int j = 0; j < smallSize; ++j) {
            if (board[startY + i][startX + j] == 1) {
                result = 0;
            }
        }
    }
    return result;
}

int kbhit(void) {
    struct timeval tv = {0L, 0L};
    fd_set fds;
    FD_ZERO(&fds);
    FD_SET(STDIN_FILENO, &fds);
    return select(STDIN_FILENO + 1, &fds, NULL, NULL, &tv) == 1;
}

void initializeBoardRandom(int (*board)[WIDTH], unsigned int seed) {
    srand(seed);
    for (int i = 0; i < HEIGHT; i++) {
        for (int j = 0; j < WIDTH; j++) {
            board[i][j] = rand() % 2;
        }
    }
}

void clearScreen() { printf("\033[H\033[J"); }

void printBoard(int (*board)[WIDTH]) {
    char liveCell = '*';
    char deadCell = ' ';

    for (int i = 0; i < HEIGHT; i++) {
        for (int j = 0; j < WIDTH; j++) {
            printf("%c", board[i][j] ? liveCell : deadCell);
        }
        printf("\n");
    }
}

int countNeighbors(int (*board)[WIDTH], int x, int y) {
    int count = 0;
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            int nx = (x + i + HEIGHT) % HEIGHT;
            int ny = (y + j + WIDTH) % WIDTH;
            count += board[nx][ny];
        }
    }
    return count;
}

bool updateBoard(int (*board)[WIDTH], bool *wasModified, int (*prevBoard)[WIDTH], int *iterationCount,
                 int *repeatCounter) {
    bool currentModified = false;
    int hide_board[HEIGHT][WIDTH];

    for (int i = 0; i < HEIGHT; i++) {
        for (int j = 0; j < WIDTH; j++) {
            int neighbors = countNeighbors(board, i, j);
            if (board[i][j]) {
                hide_board[i][j] = (neighbors == 2 || neighbors == 3);
                if (!hide_board[i][j]) {
                    currentModified = true;
                }
            } else {
                hide_board[i][j] = (neighbors == 3);
                if (hide_board[i][j]) {
                    currentModified = true;
                }
            }
        }
    }

    bool isSameAsPrevious = true;
    for (int i = 0; i < HEIGHT; i++) {
        for (int j = 0; j < WIDTH; j++) {
            if (hide_board[i][j] != prevBoard[i][j]) {
                isSameAsPrevious = false;
                break;
            }
        }
        if (!isSameAsPrevious) break;
    }

    if (isSameAsPrevious && *iterationCount > 0) {
        (*repeatCounter)++;
        if (*repeatCounter >= 5) {
            *wasModified = false;
            return false;
        }
    } else {
        *repeatCounter = 0;
    }

    for (int i = 0; i < HEIGHT; i++) {
        for (int j = 0; j < WIDTH; j++) {
            prevBoard[i][j] = board[i][j];
            board[i][j] = hide_board[i][j];
        }
    }

    *wasModified = currentModified;
    (*iterationCount)++;
    return true;
}