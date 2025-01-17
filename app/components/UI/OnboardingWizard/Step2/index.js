import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import Coachmark from '../Coachmark';
import setOnboardingWizardStep from '../../../../actions/wizard';
import { strings } from '../../../../../locales/i18n';
import onboardingStyles from './../styles';
import {
  MetaMetricsEvents,
  ONBOARDING_WIZARD_STEP_DESCRIPTION,
} from '../../../../core/Analytics';
import { mockTheme, ThemeContext } from '../../../../util/theme';
import { OnboardingWizardModalSelectorsIDs } from '../../../../../e2e/selectors/Modals/OnboardingWizardModal.selectors';
import { withMetricsAwareness } from '../../../../components/hooks/useMetrics';

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  coachmarkContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginHorizontal: 16,
  },
});

class Step2 extends PureComponent {
  static propTypes = {
    /**
     * Dispatch set onboarding wizard step
     */
    setOnboardingWizardStep: PropTypes.func,
    /**
     * Coachmark ref to get position
     */
    coachmarkRef: PropTypes.object,
    /**
     * Callback called when closing step
     */
    onClose: PropTypes.func,
    /**
     * Metrics injected by withMetricsAwareness HOC
     */
    metrics: PropTypes.object,
  };

  state = {
    coachmarkTop: 0,
  };

  componentDidMount = () => {
    this.getPosition(this.props.coachmarkRef.yourAccountRef);
  };

  /**
   * If component ref defined, calculate its position and position coachmark accordingly
   */
  getPosition = (ref) => {
    ref &&
      ref.current &&
      ref.current.measure((fx, fy, width, height, px, py) => {
        this.setState({
          coachmarkTop: py + height,
        });
      });
  };

  /**
   * Dispatches 'setOnboardingWizardStep' with next step
   */
  onNext = () => {
    const { setOnboardingWizardStep } = this.props;
    setOnboardingWizardStep && setOnboardingWizardStep(3);
    this.props.metrics.trackEvent(
      MetaMetricsEvents.ONBOARDING_TOUR_STEP_COMPLETED,
      {
        tutorial_step_count: 2,
        tutorial_step_name: ONBOARDING_WIZARD_STEP_DESCRIPTION[2],
      },
    );
  };

  /**
   * Dispatches 'setOnboardingWizardStep' with back step
   */
  onBack = () => {
    const { setOnboardingWizardStep } = this.props;
    setOnboardingWizardStep && setOnboardingWizardStep(1);
    this.props.metrics.trackEvent(
      MetaMetricsEvents.ONBOARDING_TOUR_STEP_REVISITED,
      {
        tutorial_step_count: 2,
        tutorial_step_name: ONBOARDING_WIZARD_STEP_DESCRIPTION[2],
      },
    );
  };

  getOnboardingStyles = () => {
    const colors = this.context.colors || mockTheme.colors;
    return onboardingStyles(colors);
  };

  /**
   * Calls props 'onClose'
   */
  onClose = () => {
    const { onClose } = this.props;
    onClose && onClose(false);
  };

  /**
   * Returns content for this step
   */
  content = () => {
    const dynamicOnboardingStyles = this.getOnboardingStyles();

    return (
      <View style={dynamicOnboardingStyles.contentContainer}>
        <Text
          style={dynamicOnboardingStyles.content}
          testID={OnboardingWizardModalSelectorsIDs.STEP_TWO_CONTAINER}
        >
          {strings('onboarding_wizard_new.step2.content1')}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.main}>
        <View
          style={[
            styles.coachmarkContainer,
            {
              top: this.state.coachmarkTop,
            },
          ]}
        >
          <Coachmark
            title={strings('onboarding_wizard_new.step2.title')}
            content={this.content()}
            onNext={this.onNext}
            onBack={this.onBack}
            topIndicatorPosition={'topCenter'}
            currentStep={1}
            onClose={this.onClose}
          />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setOnboardingWizardStep: (step) => dispatch(setOnboardingWizardStep(step)),
});

Step2.contextType = ThemeContext;

export default connect(null, mapDispatchToProps)(withMetricsAwareness(Step2));
