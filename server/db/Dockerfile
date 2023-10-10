FROM amazonlinux:2022

# 設定
ENV PGDATA=/var/pgdata/data\
    DB_NAME=XXXX\
    DB_PORT=XXXX\
    DB_PASS=XXXX

# アップデート及びインストール。
# util-linuxはmoreが使いたいから。moreはpsqlが利用するため。
RUN yum update -y; \
    yum install glibc-langpack-ja -y; \
    yum install tar gzip shadow-utils -y; \
    yum install make gcc readline-devel zlib-devel -y; \
    yum install procps -y; \
    yum install util-linux -y; \
    curl https://ftp.postgresql.org/pub/source/v15.1/postgresql-15.1.tar.gz --output /var/postgresql.tar.gz; \
    yum clean all; \
    rm -rf /var/cache/yum

# ロケールの設定
ENV LANG=ja_JP.utf8

# タイムゾーンの設定
RUN rm -f /etc/localtime; \
    ln -fs /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# 1. PostgreSQLのコンパイル & install
#    https://www.postgresql.org/docs/15/install-procedure.html
# 2. pg_bigmのインストールと後処理
RUN tar zxvf /var/postgresql.tar.gz -C /var/; \
    cd /var/postgresql-15.1; \
    ./configure; \
    make; \
    make install; \
    curl https://github.com/pgbigm/pg_bigm/archive/v1.2-20200228.tar.gz -L -o ./pg_bigm.tar.gz; \
    tar zxvf ./pg_bigm.tar.gz; \
    cd pg_bigm-1.2-20200228; \
    make USE_PGXS=1 PG_CONFIG=/usr/local/pgsql/bin/pg_config; \
    make USE_PGXS=1 PG_CONFIG=/usr/local/pgsql/bin/pg_config install; \
    rm /var/postgresql.tar.gz; \
    rm -rf /var/postgresql-15.1

# postgresグループ&ユーザの作成
RUN groupadd -g 54321 postgres; \
    useradd -u 54321 -g 54321 postgres
RUN echo 'postgres:${DB_PASS}' | chpasswd

# PATHにpostgres関連のコマンドのパスを追加
ENV PATH $PATH:/usr/local/pgsql/bin

# スクリプト置き場
RUN mkdir /scripts ; \
    chmod 755 /scripts

# スクリプトのコピーと権限変更
COPY ./entrypoint.sh /scripts/
COPY ./clean.sh /scripts/
RUN chmod 755 /scripts/*.sh

# このコンテナがどのポートを要求するのか、コンテナの利用者に明示する。
EXPOSE 5432

# コンテナ内の実行ユーザ
USER postgres:postgres

# エントリポイント
ENTRYPOINT ["/scripts/entrypoint.sh"]

# コンテナのデフォルトコマンド
CMD ["postgres"]