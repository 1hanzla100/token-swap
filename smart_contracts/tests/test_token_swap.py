from brownie import TokenSwap, HanzlaToken, accounts


def wei_to_eth(wei):
    return wei * 10**18


def test_deploy_job():
    token_contract = HanzlaToken.deploy(
        {"from": accounts[0]},
    )

    contract = TokenSwap.deploy(
        token_contract.address,
        100,
        {"from": accounts[0]},
    )

    assert token_contract.owner() == accounts[0].address
    assert contract.owner() == accounts[0].address
    assert token_contract.balanceOf(contract.address) == 0
    assert token_contract.balanceOf(accounts[0].address) == wei_to_eth(30000)
    token_contract.transfer(contract.address, wei_to_eth(30000), {"from": accounts[0]})
    assert token_contract.balanceOf(contract.address) == wei_to_eth(30000)


def test_buy_token():
    token_contract = HanzlaToken.deploy(
        {"from": accounts[0]},
    )

    exchange_rate = 100

    contract = TokenSwap.deploy(
        token_contract.address,
        exchange_rate,
        {"from": accounts[0]},
    )

    token_contract.transfer(
        contract.address,
        token_contract.balanceOf(accounts[0].address),
        {"from": accounts[0]},
    )

    contract.buyTokens({"from": accounts[1], "value": wei_to_eth(10)})
    assert token_contract.balanceOf(accounts[1].address) == wei_to_eth(
        10 * exchange_rate
    )


def test_sell_token():
    token_contract = HanzlaToken.deploy(
        {"from": accounts[0]},
    )

    exchange_rate = 100

    contract = TokenSwap.deploy(
        token_contract.address,
        exchange_rate,
        {"from": accounts[0]},
    )

    token_contract.transfer(
        contract.address,
        token_contract.balanceOf(accounts[0].address),
        {"from": accounts[0]},
    )

    contract.buyTokens({"from": accounts[1], "value": wei_to_eth(10)})

    token_contract.approve(
        contract.address, wei_to_eth(10 * exchange_rate), {"from": accounts[1]}
    )

    contract.sellTokens(wei_to_eth(10 * exchange_rate), {"from": accounts[1]})
    assert token_contract.balanceOf(accounts[1].address) == 0


def test_change_rate():
    token_contract = HanzlaToken.deploy(
        {"from": accounts[0]},
    )

    exchange_rate = 100

    contract = TokenSwap.deploy(
        token_contract.address,
        exchange_rate,
        {"from": accounts[0]},
    )

    assert contract.getRate({"from": accounts[0]}) == exchange_rate
    contract.changeRate(200, {"from": accounts[0]})
    assert contract.getRate({"from": accounts[0]}) == 200
