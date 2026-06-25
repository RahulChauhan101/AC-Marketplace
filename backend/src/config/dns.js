const dns = require("dns");

const configureDns = () => {
  if (!process.env.DNS_SERVERS) {
    return;
  }

  dns.setServers(process.env.DNS_SERVERS.split(",").map((server) => server.trim()));
};

module.exports = configureDns;
