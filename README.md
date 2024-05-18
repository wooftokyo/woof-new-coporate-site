# sshログイン
ssh -i ~/.ssh/id_ed25519 ken.page@34.41.72.10

# backendのデプロイ
scp -i ~/.ssh/id_ed25519 -r /Users/kenpage/Documents/GitHub/woof-new-coporate-site/backend/llama ken.page@34.41.72.10:~/new-woof-corporate-site/backend

# 仮想環境
source ~/venv/bin/activate
