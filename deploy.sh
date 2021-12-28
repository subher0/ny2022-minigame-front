#!/bin/sh
set -e

echo $SSH_CONNECTION
PUBLIC_URL=/ny2022
export PUBLIC_URL
npm run build

scp -r ./build "$SSH_CONNECTION":./workspace/ny2022-minigame-front/build/
ssh "$SSH_CONNECTION" mv ./workspace/ny2022-minigame-front/build/ny2022 ./workspace/ny2022-minigame-front/build/ny2022_old_$(date "+%Y.%m.%d-%H.%M.%S")
ssh "$SSH_CONNECTION" mv ./workspace/ny2022-minigame-front/build/build ./workspace/ny2022-minigame-front/build/ny2022
ssh "$SSH_CONNECTION" chmod 755 ./workspace/ny2022-minigame-front/build/ny2022

