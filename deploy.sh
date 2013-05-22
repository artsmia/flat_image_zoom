/usr/bin/rsync --exclude=.git* -e ssh -vzrpgt --links --copy-unsafe-links --partial  . deployer@colbert:/walker/html/sandbox/infolounge/
