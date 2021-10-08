import { log } from "@graphprotocol/graph-ts";
import {
  Staked as StakedEvent,
  Unstaked as UnstakedEvent,
} from "../generated/BottoGovernance/BottoGovernance";
import {
  Stake as StakeEvent,
  Withdraw as WithdrawEvent,
} from "../generated/BottoLiquidityMining/BottoLiquidityMining";
import { BottoEthStake, BottoStake, Staker } from "../generated/schema";

function loadStaker(id: string): Staker {
  let staker: Staker | null = Staker.load(id);
  if (staker == null) {
    staker = new Staker(id);
  }
  return <Staker>staker;
}

// BottoGovernance::Staked event handler
export function handleStaked(event: StakedEvent): void {
  let staker = loadStaker(event.params.staker.toHex());

  let stakeId =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let stake = new BottoStake(stakeId);
  stake.staker = staker.id;
  stake.start = event.block.timestamp;
  stake.amount = event.params.amount;
  stake.save();

  var currentStakeIds = staker.bottoStakeIds;
  if (currentStakeIds == null) {
    currentStakeIds = [];
  }
  currentStakeIds.push(stake.id);
  staker.bottoStakeIds = currentStakeIds;
  staker.save();
}

// BottoGovernance::Unstaked event handler
export function handleUnstaked(event: UnstakedEvent): void {
  let staker = loadStaker(event.params.staker.toHex());
  var currentStakeIds = staker.bottoStakeIds;
  for (var i = 0; i < staker.bottoStakeIds.length; i++) {
    var stakeId = currentStakeIds.shift();
    var stake = BottoStake.load(stakeId);
    if (stake.end == null) {
      stake.end = event.block.timestamp;
      stake.save();
    }
  }
}

// BottoLiquidityMining::Stake event handler
export function handleStake(event: StakeEvent): void {
  let staker = loadStaker(event.params.staker.toHex());

  let stakeId =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let stake = new BottoEthStake(stakeId);
  stake.staker = staker.id;
  stake.start = event.block.timestamp;
  stake.amount = event.params.bottoEthIn;
  stake.save();

  var currentStakeIds = staker.bottoEthStakeIds;
  if (currentStakeIds == null) {
    currentStakeIds = [];
  }
  currentStakeIds.push(stake.id);
  staker.bottoEthStakeIds = currentStakeIds;
  staker.save();
}

// BottoLiquidityMining::Withdraw event handler
export function handleWithdraw(event: WithdrawEvent): void {
  let staker = loadStaker(event.params.staker.toHex());
  var currentStakeIds = staker.bottoEthStakeIds;
  for (var i = 0; i < staker.bottoEthStakeIds.length; i++) {
    var stakeId = currentStakeIds.shift();
    var stake = BottoEthStake.load(stakeId);
    if (stake.end == null) {
      stake.end = event.block.timestamp;
      stake.save();
    }
  }
}
