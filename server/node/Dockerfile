FROM amazonlinux:2022

# アップデート及びインストール。
RUN yum update -y; \
    yum install glibc-langpack-ja -y; \
    yum install -y shadow-utils -y; \
    yum install procps -y; \
    yum install nodejs -y; \
    yum install npm -y; \
    yum clean all; \
    rm -rf /var/cache/yum

# nodeグループとnodeユーザを作成
RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# ロケールの設定
ENV LANG=ja_JP.utf8

# タイムゾーンの設定
RUN rm -f /etc/localtime; \
    ln -fs /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# スクリプト置き場
RUN mkdir /scripts ; \
    chmod 755 /scripts

# スクリプトのコピーと権限変更
COPY ./entrypoint.sh /scripts/
RUN chmod 755 /scripts/*.sh

# エントリーポイント
ENTRYPOINT ["/scripts/entrypoint.sh"]

# コンテナのデフォルトコマンド
CMD ["node"]