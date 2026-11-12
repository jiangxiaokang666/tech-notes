#include <algorithm>
#include <array>
#include <cstddef>
#include <functional>
#include <iostream>
#include <map>
#include <queue>
#include <string>
#include <vector>

using State = std::array<std::vector<int>, 3>;
constexpr char rodNames[] = {'A', 'B', 'C'};

struct Move {
    int disk;
    int from;
    int to;
};

struct Trace {
    State previous;
    Move move;
};

std::string center(const std::string& text, std::size_t width, char fill = ' ') {
    const std::size_t padding = width - text.size();
    return std::string(padding / 2, fill) + text
        + std::string(padding - padding / 2, fill);
}

void printState(const State& state, const std::vector<int>& largestFirst) {
    std::size_t labelWidth = 1;
    for (int disk : largestFirst) {
        labelWidth = std::max(labelWidth, std::to_string(disk).size());
    }
    // An odd width keeps the rod and every disk on the same center line.
    labelWidth |= 1;
    const std::size_t columnWidth = labelWidth + 2 * largestFirst.size();

    for (std::size_t level = largestFirst.size(); level > 0; --level) {
        std::string row;
        for (const auto& disks : state) {
            if (!row.empty()) {
                row += "  ";
            }
            std::string shape = "|";
            if (level <= disks.size()) {
                const int disk = disks[level - 1];
                const auto position = std::find(largestFirst.begin(), largestFirst.end(), disk);
                const auto rank = static_cast<std::size_t>(largestFirst.end() - position);
                shape = center(std::to_string(disk), labelWidth + 2 * rank, '=');
            }
            row += center(shape, columnWidth);
        }
        row.erase(row.find_last_not_of(' ') + 1);
        std::cout << row << '\n';
    }

    const std::string base(columnWidth, '-');
    std::cout << base << "  " << base << "  " << base << '\n';
    const std::string labels = center("A", columnWidth) + "  "
        + center("B", columnWidth) + "  " + std::string(columnWidth / 2, ' ') + "C";
    std::cout << labels << '\n';
}

int main() {
    int n;
    if (!(std::cin >> n) || n < 0 || n > 8) {
        return 0;
    }

    State initial;
    for (int i = 0; i < n; ++i) {
        int disk;
        if (!(std::cin >> disk)) {
            return 0;
        }
        initial[0].push_back(disk);
    }

    State goal;
    goal[2] = initial[0];
    std::sort(goal[2].begin(), goal[2].end(), std::greater<int>{});

    std::queue<State> pending;
    std::map<State, Trace> visited;
    pending.push(initial);
    visited.emplace(initial, Trace{});

    while (!pending.empty()) {
        const State current = pending.front();
        pending.pop();

        if (current == goal) {
            std::vector<Move> moves;
            for (State state = goal; state != initial;) {
                const Trace& trace = visited.at(state);
                moves.push_back(trace.move);
                state = trace.previous;
            }
            std::reverse(moves.begin(), moves.end());

            std::cout << moves.size() << '\n';
            State state = initial;
            std::cout << "Initial:\n";
            printState(state, goal[2]);

            for (std::size_t i = 0; i < moves.size(); ++i) {
                const Move& move = moves[i];
                state[move.from].pop_back();
                state[move.to].push_back(move.disk);

                std::cout << "\nStep " << i + 1 << ": disk " << move.disk
                          << ", " << rodNames[move.from] << " -> "
                          << rodNames[move.to] << '\n';
                printState(state, goal[2]);
            }
            return 0;
        }

        for (int from = 0; from < 3; ++from) {
            if (current[from].empty()) {
                continue;
            }
            const int disk = current[from].back();

            for (int to = 0; to < 3; ++to) {
                if (from == to ||
                    (!current[to].empty() && disk >= current[to].back())) {
                    continue;
                }

                State next = current;
                next[from].pop_back();
                next[to].push_back(disk);
                if (visited.emplace(next, Trace{current, {disk, from, to}}).second) {
                    pending.push(next);
                }
            }
        }
    }

    std::cout << "-1\n";
}
