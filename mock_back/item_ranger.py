import copy
import json
import random


def simulate():
    agents = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    stats_aggregate = {}
    number_of_games = 100000
    for i in range(0, number_of_games):
        pairs = {}
        for j in agents:
            pairs[j] = {}
            current_agents = agents[:]
            current_agents.remove(j)
            current_items = items[:]
            for k in current_agents:
                choice = random.choice(current_items)
                current_items.remove(choice)
                pairs[j][k] = choice
        agent_item_sums = {}
        for agent in agents:
            agent_item_sum = {}
            for item in items:
                agent_item_sum[item] = 0
            for counter_agent in pairs.keys():
                if agent in pairs[counter_agent]:
                    agent_item_sum[pairs[counter_agent][agent]] += 1
            agent_item_sums[agent] = agent_item_sum

        agent_item_sums_copy = copy.deepcopy(agent_item_sums)
        for agent in agent_item_sums.keys():
            for item in agent_item_sums[agent]:
                if agent_item_sums[agent][item] == 0:
                    agent_item_sums_copy[agent].pop(item)

        run_stats = {'pars': 0, 'distinct': 0}
        for item in items:
            max = 0
            max_count = 0
            for agent in agent_item_sums.keys():
                if item in agent_item_sums_copy[agent] and agent_item_sums_copy[agent][item] > max:
                    max = agent_item_sums_copy[agent][item]
                    max_count = 1
                elif item in agent_item_sums_copy[agent] and agent_item_sums_copy[agent][item] == max:
                    max_count += 1
            if max_count != 1:
                run_stats['pars'] += 1
            else:
                run_stats['distinct'] += 1
        # print(run_stats)
        run_stats_json = json.dumps(run_stats)
        if run_stats_json not in stats_aggregate:
            stats_aggregate[run_stats_json] = 1
        else:
            stats_aggregate[run_stats_json] += 1
    by_value = {}
    for stats in stats_aggregate.keys():
        by_value[stats_aggregate[stats]] = stats
    print('Ran ' + str(number_of_games) + ' games')
    for value in sorted(by_value.keys()):
        print(by_value[value] + ' encontred ' + str(value) + ' times. Probability: ' + str(value / number_of_games))


if __name__ == '__main__':
    simulate()