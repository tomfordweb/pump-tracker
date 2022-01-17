FROM python:3.9

WORKDIR /pumps


COPY requirements.txt .

RUN pip install -r requirements.txt

# Needed to ensure DB is available
RUN wget -P /usr/bin https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /usr/bin/wait-for-it.sh

COPY . .

