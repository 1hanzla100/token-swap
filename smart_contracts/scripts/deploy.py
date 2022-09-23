from brownie import TokenSwap, HanzlaToken, accounts, config


def wei_to_eth(wei):
    return wei * 10**18

def main():
    accounts.add(config["wallets"]["from_key"])
    
    # ? Deploy the contracts

    token_contract = HanzlaToken.deploy(
        {"from": accounts[0]},
    )

    contract = TokenSwap.deploy(
        token_contract.address,
        100,
        {"from": accounts[0]},
    )

    # ? Transfering Tokens to the contract

    token_contract.transfer(
        contract.address,
        token_contract.balanceOf(accounts[0].address) - wei_to_eth(1000),
        {"from": accounts[0]},
    )
